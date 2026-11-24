#!/usr/bin/env python3
"""Cooperative single-slot Windows supervisor; no workstation installation implied.

Win32 contracts: PERFORMANCE_INFORMATION, Job Objects, STARTUPINFOEXW and
PROC_THREAD_ATTRIBUTE_JOB_LIST/HANDLE_LIST (Windows 10+). The child is assigned
at creation, before its first instruction; the job handle is not inherited.
This is not an OS-wide security sandbox or admission for unwrapped commands.
"""
from __future__ import annotations

import argparse
from contextlib import contextmanager
import ctypes as C
from ctypes import wintypes as W
from dataclasses import dataclass
from datetime import datetime, timezone
import json
import os
from pathlib import Path, PureWindowsPath
import shutil
import subprocess
import sys
import time
import uuid

GIB = 1024**3
MUTEX = r"Global\AuditRepo.LocalHeavyJob.v1"
DEFAULT_TIMEOUT = {"browser": 600, "build": 1200, "media": 1200,
                   "asr": 1200, "pdf": 1200, "image": 1200, "other": 1200}
WAIT_OBJECT_0, WAIT_ABANDONED, WAIT_TIMEOUT = 0, 0x80, 0x102
JOB_KILL_ON_CLOSE = 0x2000
ATTR_HANDLE_LIST = 0x00020002
ATTR_JOB_LIST = 0x0002000D


@dataclass(frozen=True)
class Snapshot:
    commit: int
    limit: int
    available: int
    disk_free: tuple[int, ...]

    def valid(self) -> bool:
        return (self.limit > 0 and self.commit >= 0 and self.available >= 0
                and bool(self.disk_free) and all(v >= 0 for v in self.disk_free))

    def report(self) -> dict:
        return {"commit_bytes": self.commit, "commit_limit_bytes": self.limit,
                "available_bytes": self.available, "disk_free_bytes": self.disk_free,
                "commit_percent": round(100 * self.commit / self.limit, 2) if self.limit else None}


def admission(s: Snapshot, disk_min: int) -> tuple[str | None, bool]:
    if not s.valid() or disk_min < 15 * GIB:
        return "invalid_counters_or_disk_reserve", False
    warn = 100 * s.commit >= 75 * s.limit
    if 100 * s.commit >= 80 * s.limit:
        return "commit_at_or_above_80_percent", warn
    if s.available < 6 * GIB:
        return "available_ram_below_6_gib", warn
    if min(s.disk_free) < disk_min:
        return "insufficient_disk_reserve", warn
    return None, warn


def pressure(s: Snapshot) -> str | None:
    if not s.valid():
        return "invalid_runtime_counters"
    if 100 * s.commit >= 90 * s.limit:
        return "commit_at_or_above_90_percent"
    if s.available < 3 * GIB:
        return "available_ram_below_3_gib"
    if min(s.disk_free) < 5 * GIB:
        return "disk_free_below_5_gib"
    return None


def timeout_for(kind: str, seconds: int | None, approval: str | None) -> int:
    default = DEFAULT_TIMEOUT[kind]
    value = default if seconds is None else seconds
    if value <= 0 or value > 6 * 3600:
        raise ValueError("deadline must be 1..21600 seconds")
    if value > default and not (approval or "").strip():
        raise ValueError("extended deadline requires recorded owner approval reference")
    return value


def prohibited_image(path: str) -> bool:
    """Recognize Windows Playwright WebKit images; not a security sandbox."""
    p = PureWindowsPath(path)
    name = p.name.casefold()
    return (name in {"webkitgpuprocess.exe", "webkitwebprocess.exe", "webkitnetworkprocess.exe"}
            or any(part.casefold().startswith("webkit-") for part in p.parts)
            or name == "webkit.exe")


class EventJournal:
    """Small durable status ledger; does not log command arguments or environment."""
    def __init__(self, stream, meta: dict):
        self.stream = stream
        self.meta = meta

    def emit(self, data: dict) -> None:
        row = {**self.meta, **data, "utc": datetime.now(timezone.utc).isoformat()}
        line = json.dumps(row, ensure_ascii=True)
        self.stream.write(line + "\n")
        self.stream.flush()
        os.fsync(self.stream.fileno())
        try:
            print(line, flush=True)
        except BrokenPipeError:
            # The durable result remains available if the transport disconnects.
            pass


class Performance(C.Structure):
    _fields_ = [("cb", W.DWORD)] + [
        (name, C.c_size_t) for name in (
            "CommitTotal", "CommitLimit", "CommitPeak", "PhysicalTotal",
            "PhysicalAvailable", "SystemCache", "KernelTotal", "KernelPaged",
            "KernelNonpaged", "PageSize")
    ] + [(name, W.DWORD) for name in ("HandleCount", "ProcessCount", "ThreadCount")]


class BasicLimit(C.Structure):
    _fields_ = [("PerProcessUserTimeLimit", C.c_longlong),
                ("PerJobUserTimeLimit", C.c_longlong), ("LimitFlags", W.DWORD),
                ("MinimumWorkingSetSize", C.c_size_t), ("MaximumWorkingSetSize", C.c_size_t),
                ("ActiveProcessLimit", W.DWORD), ("Affinity", C.c_size_t),
                ("PriorityClass", W.DWORD), ("SchedulingClass", W.DWORD)]


class IoCounters(C.Structure):
    _fields_ = [(name, C.c_ulonglong) for name in (
        "ReadOperationCount", "WriteOperationCount", "OtherOperationCount",
        "ReadTransferCount", "WriteTransferCount", "OtherTransferCount")]


class ExtendedLimit(C.Structure):
    _fields_ = [("BasicLimitInformation", BasicLimit), ("IoInfo", IoCounters)] + [
        (name, C.c_size_t) for name in (
            "ProcessMemoryLimit", "JobMemoryLimit", "PeakProcessMemoryUsed", "PeakJobMemoryUsed")]


class Accounting(C.Structure):
    _fields_ = [(name, C.c_longlong) for name in (
        "TotalUserTime", "TotalKernelTime", "ThisPeriodTotalUserTime", "ThisPeriodTotalKernelTime")
    ] + [(name, W.DWORD) for name in (
        "TotalPageFaultCount", "TotalProcesses", "ActiveProcesses", "TotalTerminatedProcesses")]


class Startup(C.Structure):
    _fields_ = [("cb", W.DWORD), ("lpReserved", W.LPWSTR), ("lpDesktop", W.LPWSTR),
                ("lpTitle", W.LPWSTR)] + [(name, W.DWORD) for name in (
        "dwX", "dwY", "dwXSize", "dwYSize", "dwXCountChars", "dwYCountChars",
        "dwFillAttribute", "dwFlags")
    ] + [("wShowWindow", W.WORD), ("cbReserved2", W.WORD), ("lpReserved2", C.c_void_p),
         ("hStdInput", W.HANDLE), ("hStdOutput", W.HANDLE), ("hStdError", W.HANDLE)]


class StartupEx(C.Structure):
    _fields_ = [("StartupInfo", Startup), ("lpAttributeList", C.c_void_p)]


class ProcessInfo(C.Structure):
    _fields_ = [("hProcess", W.HANDLE), ("hThread", W.HANDLE),
                ("dwProcessId", W.DWORD), ("dwThreadId", W.DWORD)]


class Windows:
    def __init__(self):
        if os.name != "nt":
            raise OSError("Windows-only controller; use hosted execution on other platforms")
        self.k = C.WinDLL("kernel32", use_last_error=True)
        self.p = C.WinDLL("psapi", use_last_error=True)
        specs = {
            "CreateMutexW": (W.HANDLE, [C.c_void_p, W.BOOL, W.LPCWSTR]),
            "WaitForSingleObject": (W.DWORD, [W.HANDLE, W.DWORD]),
            "ReleaseMutex": (W.BOOL, [W.HANDLE]),
            "CloseHandle": (W.BOOL, [W.HANDLE]),
            "CreateFileW": (W.HANDLE, [W.LPCWSTR, W.DWORD, W.DWORD, C.c_void_p, W.DWORD, W.DWORD, W.HANDLE]),
            "CreateJobObjectW": (W.HANDLE, [C.c_void_p, W.LPCWSTR]),
            "SetInformationJobObject": (W.BOOL, [W.HANDLE, C.c_int, C.c_void_p, W.DWORD]),
            "QueryInformationJobObject": (W.BOOL, [W.HANDLE, C.c_int, C.c_void_p, W.DWORD, C.POINTER(W.DWORD)]),
            "TerminateJobObject": (W.BOOL, [W.HANDLE, W.UINT]),
            "InitializeProcThreadAttributeList": (W.BOOL, [C.c_void_p, W.DWORD, W.DWORD, C.POINTER(C.c_size_t)]),
            "UpdateProcThreadAttribute": (W.BOOL, [C.c_void_p, W.DWORD, C.c_size_t, C.c_void_p, C.c_size_t, C.c_void_p, C.c_void_p]),
            "DeleteProcThreadAttributeList": (None, [C.c_void_p]),
            "CreateProcessW": (W.BOOL, [W.LPCWSTR, W.LPWSTR, C.c_void_p, C.c_void_p, W.BOOL,
                W.DWORD, C.c_void_p, W.LPCWSTR, C.POINTER(Startup), C.POINTER(ProcessInfo)]),
            "GetExitCodeProcess": (W.BOOL, [W.HANDLE, C.POINTER(W.DWORD)]),
            "OpenProcess": (W.HANDLE, [W.DWORD, W.BOOL, W.DWORD]),
            "IsProcessInJob": (W.BOOL, [W.HANDLE, W.HANDLE, C.POINTER(W.BOOL)]),
            "QueryFullProcessImageNameW": (W.BOOL, [W.HANDLE, W.DWORD, W.LPWSTR, C.POINTER(W.DWORD)]),
            "GetProcessTimes": (W.BOOL, [W.HANDLE, C.POINTER(W.FILETIME), C.POINTER(W.FILETIME), C.POINTER(W.FILETIME), C.POINTER(W.FILETIME)]),
        }
        for name, (restype, argtypes) in specs.items():
            f = getattr(self.k, name)
            f.restype, f.argtypes = restype, argtypes
        self.p.GetPerformanceInfo.restype = W.BOOL
        self.p.GetPerformanceInfo.argtypes = [C.POINTER(Performance), W.DWORD]

    @staticmethod
    def require(value):
        if not value:
            raise C.WinError(C.get_last_error())
        return value

    def wait(self, handle, ms: int) -> int:
        result = self.k.WaitForSingleObject(handle, ms)
        if result not in (WAIT_OBJECT_0, WAIT_ABANDONED, WAIT_TIMEOUT):
            raise C.WinError(C.get_last_error())
        return result

    def wait_log_released(self, path: Path, seconds: float = 5.0) -> bool:
        """Verify inherited log handles have drained, not just job accounting.

        Windows may report zero active job members before all inherited file
        handles finish rundown. An exclusive read-open is an independent
        witness of release. A temporary sharing/lock violation is retryable;
        other errors and an expired deadline are not successful cleanup.
        """
        end = time.monotonic() + seconds
        invalid = C.c_void_p(-1).value
        while True:
            handle = self.k.CreateFileW(str(path), 0x80000000, 0, None, 3, 0x80, None)
            if handle != invalid and handle:
                self.require(self.k.CloseHandle(handle))
                return True
            error = C.get_last_error()
            if error not in (32, 33):
                raise C.WinError(error)
            remaining = end - time.monotonic()
            if remaining <= 0:
                return False
            time.sleep(min(0.05, remaining))

    def snapshot(self, disks: tuple[Path, ...]) -> Snapshot:
        p = Performance()
        p.cb = C.sizeof(p)
        self.require(self.p.GetPerformanceInfo(C.byref(p), p.cb))
        return Snapshot(p.CommitTotal * p.PageSize, p.CommitLimit * p.PageSize,
                        p.PhysicalAvailable * p.PageSize,
                        tuple(shutil.disk_usage(d).free for d in disks))


@contextmanager
def lease(api: Windows, name: str = MUTEX):
    handle = api.require(api.k.CreateMutexW(None, False, name))
    owned = False
    try:
        state = api.wait(handle, 0)
        if state == WAIT_TIMEOUT:
            yield False
        else:
            owned = True  # abandoned ownership is acquired; live counters still required
            yield True
    finally:
        try:
            if owned:
                api.require(api.k.ReleaseMutex(handle))
        finally:
            api.k.CloseHandle(handle)


class Job:
    def __init__(self, api: Windows):
        self.api = api
        self.handle = api.require(api.k.CreateJobObjectW(None, None))
        self.process = None
        self.pid = None
        try:
            limits = ExtendedLimit()
            limits.BasicLimitInformation.LimitFlags = JOB_KILL_ON_CLOSE
            api.require(api.k.SetInformationJobObject(self.handle, 9, C.byref(limits), C.sizeof(limits)))
        except BaseException:
            api.k.CloseHandle(self.handle)
            self.handle = None
            raise

    def __enter__(self):
        return self

    def __exit__(self, *_):
        # The job is unnamed and not inheritable. Closing the last handle kills
        # contained children even on wrapper failure/forced exit.
        if self.handle:
            self.api.k.CloseHandle(self.handle)
            self.handle = None
        if self.process:
            self.api.k.CloseHandle(self.process)
            self.process = None

    def start(self, command: list[str], cwd: Path, log) -> int:
        import msvcrt
        if self.process is not None:
            raise RuntimeError("job already launched")
        api = self.api
        size = C.c_size_t(0)
        api.k.InitializeProcThreadAttributeList(None, 2, 0, C.byref(size))
        if size.value == 0:
            raise C.WinError(C.get_last_error())
        buf = C.create_string_buffer(size.value)
        attr = C.cast(buf, C.c_void_p)
        api.require(api.k.InitializeProcThreadAttributeList(attr, 2, 0, C.byref(size)))
        try:
            with open(os.devnull, "rb") as nul:
                h_in = msvcrt.get_osfhandle(nul.fileno())
                h_out = msvcrt.get_osfhandle(log.fileno())
                old_in, old_out = os.get_handle_inheritable(h_in), os.get_handle_inheritable(h_out)
                try:
                    os.set_handle_inheritable(h_in, True)
                    os.set_handle_inheritable(h_out, True)
                    handles = (W.HANDLE * 2)(h_in, h_out)
                    jobs = (W.HANDLE * 1)(self.handle)
                    api.require(api.k.UpdateProcThreadAttribute(attr, 0, ATTR_HANDLE_LIST, C.byref(handles), C.sizeof(handles), None, None))
                    api.require(api.k.UpdateProcThreadAttribute(attr, 0, ATTR_JOB_LIST, C.byref(jobs), C.sizeof(jobs), None, None))
                    si = StartupEx()
                    si.StartupInfo.cb = C.sizeof(si)
                    si.StartupInfo.dwFlags = 0x100  # STARTF_USESTDHANDLES
                    si.StartupInfo.hStdInput = h_in
                    si.StartupInfo.hStdOutput = si.StartupInfo.hStdError = h_out
                    si.lpAttributeList = attr
                    pi = ProcessInfo()
                    line = C.create_unicode_buffer(subprocess.list2cmdline(command))
                    # Creation-time job association; no suspended-but-unowned fallback.
                    api.require(api.k.CreateProcessW(command[0], line, None, None, True,
                        0x00080000 | 0x08000000, None, str(cwd),
                        C.byref(si.StartupInfo), C.byref(pi)))
                    self.process, self.pid = pi.hProcess, int(pi.dwProcessId)
                    api.k.CloseHandle(pi.hThread)
                finally:
                    os.set_handle_inheritable(h_in, old_in)
                    os.set_handle_inheritable(h_out, old_out)
        finally:
            api.k.DeleteProcThreadAttributeList(attr)
        return self.pid

    def active(self) -> int:
        info = Accounting()
        self.api.require(self.api.k.QueryInformationJobObject(
            self.handle, 1, C.byref(info), C.sizeof(info), None))
        return info.ActiveProcesses

    def creation_time(self) -> str:
        created, exited, kernel, user = (W.FILETIME() for _ in range(4))
        self.api.require(self.api.k.GetProcessTimes(
            self.process, C.byref(created), C.byref(exited), C.byref(kernel), C.byref(user)))
        ticks = (created.dwHighDateTime << 32) | created.dwLowDateTime
        return datetime.fromtimestamp(ticks / 10_000_000 - 11644473600, timezone.utc).isoformat()

    def process_ids(self) -> tuple[int, ...]:
        # JobObjectBasicProcessIdList. Retry a bounded number of times if the
        # list grows while we query; never scan/attach to owner processes.
        capacity = 64
        while capacity <= 4096:
            class IdList(C.Structure):
                _fields_ = [("NumberOfAssignedProcesses", W.DWORD),
                            ("NumberOfProcessIdsInList", W.DWORD),
                            ("ProcessIdList", C.c_size_t * capacity)]
            info = IdList()
            ok = self.api.k.QueryInformationJobObject(
                self.handle, 3, C.byref(info), C.sizeof(info), None)
            if ok and info.NumberOfProcessIdsInList <= capacity:
                if info.NumberOfAssignedProcesses <= info.NumberOfProcessIdsInList:
                    return tuple(int(info.ProcessIdList[i]) for i in range(info.NumberOfProcessIdsInList))
            elif not ok and C.get_last_error() != 234:  # ERROR_MORE_DATA
                raise C.WinError(C.get_last_error())
            capacity *= 2
        raise RuntimeError("owned job process list too large or unstable")

    def prohibited_child(self) -> bool:
        for pid in self.process_ids():
            h = self.api.k.OpenProcess(0x1000, False, pid)  # QUERY_LIMITED_INFORMATION
            if not h:
                error = C.get_last_error()
                if pid in self.process_ids():
                    raise C.WinError(error)
                continue  # transient child already exited
            try:
                member = W.BOOL()
                self.api.require(self.api.k.IsProcessInJob(h, self.handle, C.byref(member)))
                if not member.value:
                    continue  # PID reuse: not our job, do not inspect the image
                size = W.DWORD(32768)
                buf = C.create_unicode_buffer(size.value)
                if not self.api.k.QueryFullProcessImageNameW(h, 0, buf, C.byref(size)):
                    error = C.get_last_error()
                    if pid in self.process_ids():
                        raise C.WinError(error)
                    continue
                if prohibited_image(buf.value):
                    return True
            finally:
                self.api.k.CloseHandle(h)
        return False

    def exited(self, ms: int) -> bool:
        return self.api.wait(self.process, ms) == WAIT_OBJECT_0

    def exit_code(self) -> int:
        code = W.DWORD()
        self.api.require(self.api.k.GetExitCodeProcess(self.process, C.byref(code)))
        return code.value

    def wait_empty(self, seconds: float) -> bool:
        end = time.monotonic() + seconds
        while self.active() != 0:
            if time.monotonic() >= end:
                return False
            time.sleep(0.05)
        return True

    def stop(self) -> bool:
        if self.active():
            self.api.require(self.api.k.TerminateJobObject(self.handle, 1))
        return self.wait_empty(5.0)


def run_owned_job(api: Windows, command: list[str], cwd: Path, log,
                  seconds: int, before: Snapshot, warning: bool, event, sample) -> dict:
    with Job(api) as job:
        start = time.monotonic()
        try:
            pid = job.start(command, cwd, log)
            event({"status": "STARTED", "pid": pid, "root_created_utc": job.creation_time(),
                   "deadline_seconds": seconds, "before": before.report(), "warning": warning})
            end = start + seconds
            while True:
                if job.prohibited_child():
                    return {"status": "POLICY_STOP", "reason": "local_webkit_child",
                            "cleanup_verified": job.stop(), "pid": pid, "exit": 26}
                remaining = end - time.monotonic()
                if remaining <= 0:
                    return {"status": "TIMEOUT", "cleanup_verified": job.stop(), "pid": pid, "exit": 21}
                if job.exited(max(1, min(500, int(remaining * 1000)))):
                    code = job.exit_code()
                    if not job.wait_empty(2.0):
                        return {"status": "ORPHAN_CHILDREN", "child_exit": code,
                                "cleanup_verified": job.stop(), "pid": pid, "exit": 23}
                    return {"status": "PASS" if code == 0 else "CHILD_FAILED",
                            "child_exit": code, "cleanup_verified": True, "pid": pid,
                            "exit": 0 if code == 0 else 24}
                current = sample()
                reason = pressure(current)
                if reason:
                    return {"status": "PRESSURE_STOP", "reason": reason,
                            "sample": current.report(), "cleanup_verified": job.stop(), "pid": pid, "exit": 22}
        except BaseException:
            # A counter failure or interrupt is fail-closed, not a success.
            if job.process:
                job.stop()
            raise


def run_guarded(api: Windows, command: list[str], cwd: Path, log_path: Path,
                seconds: int, disk_min: int, disks: tuple[Path, ...],
                event, sample=None, mutex_name: str = MUTEX) -> dict:
    # sample/mutex injection is for isolated tests only, not exposed by CLI.
    sample = sample or (lambda: api.snapshot(disks))
    with lease(api, mutex_name) as owned:
        if not owned:
            return {"status": "DENIED", "reason": "shared_slot_busy", "exit": 20}
        before = sample()
        denied, warning = admission(before, disk_min)
        if denied:
            return {"status": "DENIED", "reason": denied, "before": before.report(), "exit": 20}
        # Keep the machine-wide lease held until the owned process tree AND
        # its inherited log handles are gone. Opening the log exclusively here
        # also means a failed open cannot mistake someone else's file for ours.
        log = log_path.open("xb", buffering=0)
        try:
            with log:
                result = run_owned_job(api, command, cwd, log, seconds, before, warning, event, sample)
        except BaseException:
            if not api.wait_log_released(log_path):
                raise RuntimeError("owned log handle rundown unverified after failure")
            raise
        if not api.wait_log_released(log_path):
            return {**result, "prior_status": result["status"], "status": "CLEANUP_HOLD",
                    "reason": "owned_log_handle_rundown_timeout", "cleanup_verified": False, "exit": 27}
        return result



def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--lane", required=True)
    parser.add_argument("--input-id", required=True, help="exact commit or local input identity, not a secret")
    parser.add_argument("--kind", choices=DEFAULT_TIMEOUT, required=True)
    parser.add_argument("--engine", choices=("none", "chromium", "firefox", "webkit"), default="none")
    parser.add_argument("--accelerator", choices=("cpu", "cuda"), default="cpu")
    parser.add_argument("--workdir", type=Path, required=True)
    parser.add_argument("--log", type=Path, required=True, help="new explicit log outside tracked source")
    parser.add_argument("--disk-path", type=Path, action="append", default=[], help="existing output directory, repeatable")
    parser.add_argument("--min-free-gib", type=int, default=15)
    parser.add_argument("--timeout-seconds", type=int)
    parser.add_argument("--approval-ref", help="recorded owner approval for extended deadline")
    parser.add_argument("command", nargs=argparse.REMAINDER)
    a = parser.parse_args(argv)
    meta = {"job_id": uuid.uuid4().hex, "repo": a.repo, "lane": a.lane, "input_id": a.input_id,
            "kind": a.kind, "engine": a.engine, "accelerator": a.accelerator,
            "supervisor_pid": os.getpid(), "log": str(a.log)}
    def emit(data):
        print(json.dumps({**meta, **data, "utc": datetime.now(timezone.utc).isoformat()}, ensure_ascii=True), flush=True)
    try:
        if a.engine == "webkit" or a.accelerator == "cuda":
            raise ValueError("WebKit/CUDA are not admitted by this initial Windows controller")
        if a.kind == "browser" and a.engine not in ("chromium", "firefox"):
            raise ValueError("declare one Chromium or Firefox engine")
        if a.min_free_gib < 15:
            raise ValueError("minimum free disk reserve is 15 GiB")
        seconds = timeout_for(a.kind, a.timeout_seconds, a.approval_ref)
        command = a.command[1:] if a.command[:1] == ["--"] else a.command
        if not command or not Path(command[0]).is_absolute() or Path(command[0]).suffix.lower() != ".exe":
            raise ValueError("provide one absolute .exe command after --; no implicit shell")
        for p in (a.workdir, a.log, *a.disk_path):
            if not p.is_absolute():
                raise ValueError("workdir/log/output paths must be absolute")
        executable = Path(command[0]).resolve(strict=True)
        if not executable.is_file():
            raise ValueError("executable must be an existing file")
        if prohibited_image(str(executable)):
            raise ValueError("local WebKit executable denied")
        cwd = a.workdir.resolve(strict=True)
        log = a.log.resolve()
        disks = tuple(dict.fromkeys((cwd, log.parent, *(p.resolve(strict=True) for p in a.disk_path))))
        events = log.with_name(log.name + ".events.jsonl")
        if not all(p.is_dir() for p in disks) or log.exists() or events.exists():
            raise ValueError("directories must exist; log and event ledger must be new files")
        api = Windows()
        with events.open("x", encoding="utf-8") as stream:
            journal = EventJournal(stream, {**meta, "events": str(events)})
            journal.emit({"status": "ADMISSION_REQUEST"})
            try:
                result = run_guarded(api, [str(executable), *command[1:]], cwd, log, seconds,
                                     a.min_free_gib * GIB, disks, journal.emit)
            except (OSError, ValueError, RuntimeError, KeyboardInterrupt) as exc:
                result = {"status": "INFRASTRUCTURE_HOLD", "reason": type(exc).__name__,
                          "winerror": getattr(exc, "winerror", None), "message": str(exc), "exit": 25}
            journal.emit(result)
            return result["exit"]
    except (OSError, ValueError, RuntimeError, KeyboardInterrupt) as exc:
        emit({"status": "INFRASTRUCTURE_HOLD", "reason": type(exc).__name__,
              "winerror": getattr(exc, "winerror", None), "message": str(exc), "exit": 25})
        return 25


if __name__ == "__main__":
    raise SystemExit(main())
