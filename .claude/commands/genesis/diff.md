---
description: Show downstream impact of artifact changes
argument-hint: "[artifact-path]"
---

# Genesis Diff — Impact Analysis

Analyze the downstream impact of modifying an artifact before making changes.

## Pre-flight

The user provides an artifact path (e.g., `.genesis/specs/auth/spec.md`, `.genesis/constitution.md`, `.genesis/design/overview.md`).

Read the specified artifact and identify its type:
- **Constitution** — affects everything downstream
- **Design doc** — affects specs, plans, tasks referencing it
- **Spec** — affects plan, tasks, implementation for that feature
- **Plan** — affects tasks and implementation for that feature
- **Tasks** — affects implementation for that feature

## Process

### 1. Identify Downstream Artifacts

Based on artifact type, scan for all files that depend on or reference it:

| Artifact Type | Downstream Artifacts |
|---------------|---------------------|
| Constitution | All specs, plans, tasks, implementations, design docs |
| Design overview | All feature designs, specs, plans |
| Feature design | Related specs, plans, tasks |
| Spec | Plan, tasks, implementation (for that feature) |
| Plan | Tasks, implementation (for that feature) |
| Tasks | Implementation (for that feature) |

### 2. Analyze Impact

For each downstream artifact, check:
- Does it directly reference or depend on the artifact being changed?
- What sections/requirements would be affected?
- Is downstream work already complete (harder to change) or still pending?

### 3. Report

Display a structured impact report:

```
Impact Analysis: {artifact-path}
Artifact Type: {type}

DOWNSTREAM DEPENDENCIES:
  {artifact-1} — {status: Draft|Complete} — {impact description}
  {artifact-2} — {status: Draft|Complete} — {impact description}
  ...

RISK ASSESSMENT:
  Cascading changes needed: {count}
  Completed work affected: {count}
  Estimated rework: {Low|Medium|High}

RECOMMENDATION:
  {Proceed with caution / Safe to modify / Consider alternatives}
```

### 4. If Constitutional Change

If the artifact is the constitution, perform a thorough scan:
1. List every spec that references the affected section
2. List every plan constrained by the affected rule
3. List every completed implementation that may now be non-compliant
4. Warn: "Constitutional changes affect the entire project. Consider using /genesis:constitute to formally amend."

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_diff` hooks and execute their instructions.
After completing: check for extensions with `after_diff` hooks and execute their instructions.
