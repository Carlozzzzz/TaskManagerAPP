<!-- GENERATED from ai-workbench-v2 v0.1.0 | profile: taskmanager | kind: claude -->

# AI instructions - TaskManagerAPP (profile: taskmanager)

Active profile: taskmanager. Do not switch unless the user explicitly asks; warn before switching.
At session start, ask once whether this project is synced with the taskmanager profile. Do not ask again after that.

@AGENTS.md

# Claude Code appendix

This section applies to Claude Code only.

## Model switching

- Do not claim to switch models. You cannot do it yourself.
- Suggest a switch only when the profile defines a model policy.
- Tell the user the exact command and wait for confirmation that the switch
  happened before continuing.

## Skills

- Project skills live in the repository, not in a global skill manager. Edit them
  in the repository.
- Use the skills the profile lists for the current task.
- Keep the profile's skill registry up to date when a skill is added, changed, or
  removed.

## Context

- You cannot run context commands yourself. Suggest them and let the user run
  them.
- Suggest a context action at most once at a moment, as the last line of the
  reply, with a one-line reason.

## Imports

- This file is generated for Claude Code. `CLAUDE.md` imports `AGENTS.md` so the
  shared rules are not duplicated.
- If imports are not expanded in your environment, regenerate with the full
  Claude document and do not keep both versions.

## Configuration files

- When drafting changes to AI configuration files, draft them under a name the
  tool will not load as live instructions, and rename them on apply.
