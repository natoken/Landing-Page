---
description: Revert an artifact to a previous version
argument-hint: "[artifact-path]"
---

# Genesis Rollback

Revert a Genesis artifact to a previous version using git history and the artifact's changelog.

## Pre-flight

If $ARGUMENTS is empty, ask: "Which artifact would you like to rollback? Provide the path (e.g., `.genesis/specs/auth/spec.md`) or feature name."

Read the artifact and check its `**Version:**` and `Changelog` section.

## Process

### 1. Show Version History

Read the artifact's Changelog section and supplement with git log:

```
Version History for {artifact-path}:

From Changelog:
  v2.0 (2026-03-05) — Added payment integration requirements
  v1.0 (2026-03-01) — Initial specification

From Git:
  abc1234 (2026-03-05) — genesis: update spec auth (current)
  def5678 (2026-03-03) — genesis: clarify auth
  ghi9012 (2026-03-01) — genesis: specify auth
```

### 2. Select Target Version

Ask: "Which version would you like to rollback to?"

Present options from the changelog and git history.

### 3. Impact Analysis

Before rolling back, check downstream artifacts:
- If rolling back a **spec**: Check if plan, tasks, or implementation exist
- If rolling back a **plan**: Check if tasks or implementation exist
- If rolling back a **constitution section**: Run full amendment impact analysis

Report:
```
Rolling back {artifact} to v{X} will affect:
  - plan.md (built against v{Y}, now reverting to v{X})
  - tasks.md (derived from plan built against v{Y})
  - Implementation (3 tasks completed against current version)

Recommendation: {Proceed with caution / Review downstream artifacts after rollback}
```

### 4. User Confirmation

"This will revert {artifact} to version {X}. Downstream artifacts may need updating. Proceed?"

### 5. Execute Rollback

1. Retrieve the target version content from git: `git show {commit}:{path}`
2. Replace the current artifact with the target version content
3. Update the Version field to reflect the rollback: `**Version:** {X} (rolled back from {Y})`
4. Add a changelog entry:
   ```
   | {X}.1 | {date} | Rolled back to v{X} | {user-provided reason} |
   ```

### 6. Update Project State

- Session log entry: "Rolled back {artifact} from v{Y} to v{X}: {reason}"
- If downstream artifacts are affected, note them as needing review

### 7. Git Commit

`genesis: rollback {artifact-name} to v{X}`

### 8. Post-Rollback Guidance

If downstream artifacts exist:
- "The plan for this feature was built against the newer spec version. Consider re-running `/genesis:plan {feature}` to update."
- "Tasks may reference requirements that no longer exist in the rolled-back version. Run `/genesis:analyze {feature}` to check consistency."

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_rollback` hooks and execute their instructions.
After completing: check for extensions with `after_rollback` hooks and execute their instructions.
