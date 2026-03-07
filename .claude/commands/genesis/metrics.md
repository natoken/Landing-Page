---
description: Project health dashboard with quantitative metrics
---

# Genesis Metrics

Quantitative project health dashboard. Complements `/genesis:status` (qualitative) with numbers.

## Process

### 1. Gather Data

Scan all Genesis artifacts to collect metrics:

**Feature Pipeline:**
- Count specs in `.genesis/specs/*/spec.md` — group by status (Draft, In Review, Approved, Retroactive)
- Count plans in `.genesis/plans/*/plan.md` — group by status (Draft, Approved)
- Count task files in `.genesis/tasks/*/tasks.md` — extract progress from each
- Count completed features from `project-state.md`

**Task Metrics:**
- Total tasks across all features
- Tasks by status: Pending, In Progress, Complete, Blocked
- Tasks by complexity: Small, Medium, Large
- Blocked tasks and their reasons

**Quality Metrics:**
- Open questions across all specs (count unchecked `- [ ]` in Open Questions sections)
- Constitutional amendments count and recency
- Features with review reports vs features without

**Velocity (if session log has enough data):**
- Tasks completed per session (average of last 5 sessions)
- Features completed total
- Time from specify to review (if dates available in artifacts)

### 2. Display Dashboard

```
╔══════════════════════════════════════════╗
║          PROJECT HEALTH METRICS          ║
╠══════════════════════════════════════════╣

  FEATURE PIPELINE
  ─────────────────
  Specified:    {N}  (Draft: {N}, Approved: {N})
  Planned:      {N}  (Draft: {N}, Approved: {N})
  In Progress:  {N}
  Completed:    {N}
  Archived:     {N}

  TASKS
  ─────
  Total:     {N} across {N} features
  Complete:  {N} ({percentage}%)  ████████░░
  Pending:   {N}
  Blocked:   {N}

  Complexity: {N} Small, {N} Medium, {N} Large

  QUALITY
  ───────
  Open questions:        {N} across {N} specs
  Constitution amendments: {N} total
  Features reviewed:     {N} / {N} completed

  VELOCITY
  ────────
  Avg tasks/session:     {N} (last 5 sessions)
  Features completed:    {N} total

╚══════════════════════════════════════════╝
```

### 3. Brownfield-Specific Metrics

If mode is Brownfield, add:

```
  CONVERGENCE
  ───────────
  Retroactive specs:     {N} / {estimated total}
  Technical debt items:  {N} open
  Convergence progress:  {percentage}%
```

### 4. Lowfield-Specific Metrics

If mode is Lowfield, add:

```
  CONTENT
  ───────
  Content items:    {N} total
  Custom commands:  {N} defined
  Last activity:    {date}
```

### 5. Recommendations

Based on metrics, suggest improvements:
- If blocked tasks > 0: "Resolve {N} blocked tasks to unblock progress."
- If open questions > 5: "Consider running /genesis:clarify on specs with open questions."
- If no amendments but > 3 features: "Consider a constitutional review — /genesis:amend."
- If velocity trending down: "Task complexity may be increasing. Consider splitting Large tasks."

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_metrics` hooks and execute their instructions.
After completing: check for extensions with `after_metrics` hooks and execute their instructions.
