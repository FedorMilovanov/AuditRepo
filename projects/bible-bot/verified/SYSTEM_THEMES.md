# System Themes — bible-bot

## Declared infrastructure vs live control plane

The active root is a platform-authority mismatch: repository `render.yaml` declares the intended readiness/deploy policy while the live Render service currently uses different settings. Runtime endpoint health is a separate witness, not a reason to erase the control-plane root.
