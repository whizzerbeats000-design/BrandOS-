You are an AI coding agent. Your job is to complete exactly ONE task, commit, and stop.

## STEP 1: Read the task list

Read `@.agent/tasks.json`. Find the first task with `"passes": false` at the highest priority. Read that task's spec from `.agent/tasks/TASK-{ID}.json`.

## STEP 2: Implement the task

Work directory is already set to the project root. Read ONLY the files referenced in the task spec. Do NOT read files outside the task spec unless absolutely necessary. Implement the changes described in the task spec.

## STEP 3: Verify

Run these commands in order:
1. `npx tsc --noEmit` — fix any type errors
2. `npx eslint src/ --max-warnings 0` — fix any lint errors  
3. `npx vitest run` — fix any test failures

## STEP 4: Commit and mark done

1. Update `.agent/tasks.json`: set the task's `"passes": true`
2. `git add -A && git commit -m "feat: complete TASK-{ID}: {task title}"`
3. Output `<promise>TASK-{ID}:DONE</promise>` and STOP. Nothing else.

## Rules

- Do NOT read more than 5 files before writing code. If you're just reading, you're stalling — start implementing.
- Do NOT re-read files. Do NOT re-run checks that already passed.
- If all tests pass, commit immediately. Do not re-verify.
- If blocked by environment issues (no network, missing deps), output `<promise>BLOCKED:description</promise>`
- Kill background processes (dev server) before committing.
- No git push. No git init/remote changes.
<promise>BLOCKED:brief description</promise>
```

**Exit immediately (no workarounds) for environment constraints you cannot fix from inside the sandbox:**

- `Blocked by network policy` → firewall, only user can change from host
- Missing/invalid credentials or API keys
- Required system service unavailable
- Hardware/arch incompatibility with no known fix

These are not bugs. No amount of retries, alternative downloads, or package managers will help. Output BLOCKED on first failure.

2. **DECIDE** — need human input: lib choices, architecture, unclear requirements, breaking changes. Output:

```
<promise>DECIDE:question (Option A vs B)</promise>
```
