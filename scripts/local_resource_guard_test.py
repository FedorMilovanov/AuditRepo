#!/usr/bin/env python3
"""Portable policy tests and actual Windows Job Object integration tests."""
import json
import os
import shutil
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import threading
from unittest.mock import patch
import unittest
import uuid

from local_resource_guard import (
    GIB, Job, Snapshot, Windows, admission, pressure, timeout_for, lease, run_guarded,
    WAIT_OBJECT_0, prohibited_image, EventJournal,
)


def snap(percent=50, ram=12, disk=30):
    return Snapshot(percent * GIB, 100 * GIB, ram * GIB, (disk * GIB,))


class Policy(unittest.TestCase):
    def test_thresholds(self):
        self.assertEqual(admission(snap(74), 15 * GIB), (None, False))
        self.assertEqual(admission(snap(75), 15 * GIB), (None, True))
        self.assertEqual(admission(snap(79), 15 * GIB), (None, True))
        self.assertEqual(admission(snap(80), 15 * GIB)[0], "commit_at_or_above_80_percent")
        self.assertIsNone(pressure(snap(89)))
        self.assertEqual(pressure(snap(90)), "commit_at_or_above_90_percent")

    def test_missing_and_disk(self):
        self.assertIsNotNone(admission(Snapshot(1, 0, 1, ()), 15 * GIB)[0])
        self.assertIsNotNone(admission(snap(ram=5), 15 * GIB)[0])
        self.assertIsNotNone(admission(snap(disk=14), 15 * GIB)[0])
        self.assertIsNotNone(admission(snap(disk=20), 25 * GIB)[0])
        self.assertIsNotNone(admission(snap(), 14 * GIB)[0])
        self.assertIsNotNone(pressure(snap(ram=2)))
        self.assertIsNotNone(pressure(snap(disk=4)))

    def test_prohibited_images(self):
        self.assertTrue(prohibited_image(r"C:\Temp\WebKitGPUProcess.exe"))
        self.assertTrue(prohibited_image(r"C:\ms-playwright\webkit-2248\Playwright.exe"))
        self.assertFalse(prohibited_image(r"C:\ms-playwright\chromium-1234\chrome.exe"))
        self.assertFalse(prohibited_image(r"C:\ms-playwright\firefox-1538\firefox.exe"))

    def test_event_journal(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "events.jsonl"
            with p.open("x", encoding="utf-8") as stream:
                j = EventJournal(stream, {"job_id": "fixture"})
                j.emit({"status": "STARTED", "pid": 42})
                j.emit({"status": "PASS", "cleanup_verified": True})
            rows = [json.loads(x) for x in p.read_text().splitlines()]
            self.assertEqual([x["status"] for x in rows], ["STARTED", "PASS"])
            self.assertTrue(all(x["job_id"] == "fixture" and x["utc"] for x in rows))

    def test_deadlines(self):
        self.assertEqual(timeout_for("browser", None, None), 600)
        self.assertEqual(timeout_for("build", None, None), 1200)
        with self.assertRaises(ValueError):
            timeout_for("browser", 601, None)
        with self.assertRaises(ValueError):
            timeout_for("build", 0, "approved")
        self.assertEqual(timeout_for("media", 3600, "owner approval"), 3600)


@unittest.skipUnless(os.name == "nt", "Windows integration requires a Windows runner")
class WindowsIntegration(unittest.TestCase):
    def setUp(self):
        self.api = Windows()
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.name = "Global\\AuditRepo.LocalHeavyJob.test." + uuid.uuid4().hex
        self.python = str(Path(sys.executable).resolve())

    def tearDown(self):
        self.tmp.cleanup()

    def run_child(self, code, name, seconds=8, sample=None):
        return run_guarded(self.api, [self.python, "-c", code], self.root, self.root / name,
                           seconds, 15 * GIB, (self.root,), lambda data: None,
                           sample or (lambda: snap()), self.name)

    def test_live_counters(self):
        self.assertTrue(self.api.snapshot((self.root,)).valid())

    def test_log_handle_rundown(self):
        path = self.root / "held.log"
        path.write_bytes(b"fixture")
        with path.open("rb") as held:
            self.assertFalse(self.api.wait_log_released(path, seconds=0.05))
            timer = threading.Timer(0.20, held.close)
            timer.start()
            try:
                self.assertTrue(self.api.wait_log_released(path, seconds=2.0))
            finally:
                timer.join(timeout=2.0)
        path.unlink()

    def test_cleanup_hold_is_not_pass(self):
        with patch.object(self.api, "wait_log_released", return_value=False):
            r = self.run_child("print('ok')", "cleanup-hold.log")
        self.assertEqual(r["status"], "CLEANUP_HOLD", r)
        self.assertEqual(r["prior_status"], "PASS")
        self.assertFalse(r["cleanup_verified"])
        self.assertEqual(r["exit"], 27)

    def test_success_nonzero_and_log(self):
        r = self.run_child("print('witness', flush=True)", "success.log")
        self.assertEqual(r["status"], "PASS", r)
        self.assertTrue(r["cleanup_verified"])
        self.assertIn("witness", (self.root / "success.log").read_text())
        r = self.run_child("raise SystemExit(7)", "failure.log")
        self.assertEqual(r["status"], "CHILD_FAILED", r)
        self.assertEqual(r["child_exit"], 7)

    def test_denial_does_not_launch(self):
        r = self.run_child("raise SystemExit(99)", "denied.log", sample=lambda: snap(80))
        self.assertEqual(r["status"], "DENIED", r)
        self.assertFalse((self.root / "denied.log").exists())

    def test_runtime_pressure(self):
        samples = iter((snap(50), snap(90)))
        r = self.run_child("import time; time.sleep(60)", "pressure.log", sample=lambda: next(samples))
        self.assertEqual(r["status"], "PRESSURE_STOP", r)
        self.assertTrue(r["cleanup_verified"])

    def test_timeout_and_descendant_cleanup(self):
        marker = self.root / "child.pid"
        child = "import time; time.sleep(120)"
        code = ("import subprocess,sys,time,pathlib;"
                f"p=subprocess.Popen([sys.executable,'-c',{child!r}]);"
                f"pathlib.Path({str(marker)!r}).write_text(str(p.pid));time.sleep(120)")
        r = self.run_child(code, "timeout.log", seconds=4)
        self.assertEqual(r["status"], "TIMEOUT", r)
        self.assertTrue(marker.exists(), "descendant was never launched")
        self.assertTrue(r["cleanup_verified"])

    def test_real_prohibited_child_cleanup(self):
        # Harmless loopback program under the exact incident executable name.
        # This tests real process-tree detection, not a browser/GPU workload.
        binary = self.root / "WebKitGPUProcess.exe"
        shutil.copyfile(Path(os.environ["SystemRoot"]) / "System32" / "ping.exe", binary)
        code = ("import subprocess,time;"
                f"subprocess.Popen([{str(binary)!r},'-t','127.0.0.1']);time.sleep(30)")
        r = self.run_child(code, "policy-stop.log")
        self.assertEqual(r["status"], "POLICY_STOP", r)
        self.assertTrue(r["cleanup_verified"])

    def test_orphan_is_not_pass(self):
        code = "import subprocess,sys; subprocess.Popen([sys.executable,'-c','import time; time.sleep(120)'])"
        r = self.run_child(code, "orphan.log")
        self.assertEqual(r["status"], "ORPHAN_CHILDREN", r)
        self.assertTrue(r["cleanup_verified"])

    def test_lock_contention_and_release(self):
        module_dir = str(Path(__file__).resolve().parent)
        code = (f"import sys;sys.path.insert(0,{module_dir!r});"
                "from local_resource_guard import Windows,lease\n"
                f"with lease(Windows(),{self.name!r}) as owned:\n print(owned,flush=True)\n")
        with lease(self.api, self.name) as owned:
            self.assertTrue(owned)
            r = subprocess.run([self.python, "-c", code], capture_output=True, text=True, timeout=10)
            self.assertEqual(r.returncode, 0, r.stderr)
            self.assertEqual(r.stdout.strip(), "False")
        r = subprocess.run([self.python, "-c", code], capture_output=True, text=True, timeout=10)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(r.stdout.strip(), "True")

    def test_wrapper_death_kills_its_job(self):
        module_dir = str(Path(__file__).resolve().parent)
        marker = self.root / "root.pid"
        log = self.root / "crash.log"
        code = (f"import sys;sys.path.insert(0,{module_dir!r})\n"
                "from local_resource_guard import Windows,Job,lease\n"
                "from pathlib import Path\nimport time\n"
                f"with lease(Windows(),{self.name!r}) as owned:\n"
                " assert owned\n"
                f" with open({str(log)!r},'xb',buffering=0) as log, Job(Windows()) as job:\n"
                f"  pid=job.start([{self.python!r},'-c','import time; time.sleep(120)'],Path({str(self.root)!r}),log)\n"
                f"  Path({str(marker)!r}).write_text(str(pid))\n"
                "  time.sleep(120)\n")
        supervisor = subprocess.Popen([self.python, "-c", code], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        handle = None
        try:
            end = time.monotonic() + 10
            while not marker.exists():
                self.assertIsNone(supervisor.poll(), "supervisor exited before launching")
                self.assertLess(time.monotonic(), end, "supervisor did not create witness")
                time.sleep(0.05)
            # Hold the real process handle, not a potentially reused PID.
            pid = int(marker.read_text())
            handle = self.api.require(self.api.k.OpenProcess(0x00100000, False, pid))
            supervisor.kill()
            supervisor.wait(timeout=10)
            self.assertEqual(self.api.wait(handle, 10000), WAIT_OBJECT_0)
            with lease(self.api, self.name) as owned:
                self.assertTrue(owned)
        finally:
            if supervisor.poll() is None:
                supervisor.kill()
                supervisor.wait(timeout=10)
            if handle:
                self.api.k.CloseHandle(handle)


if __name__ == "__main__":
    unittest.main(verbosity=2)
