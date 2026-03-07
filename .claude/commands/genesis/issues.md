---
description: Create GitHub Issues from task breakdown
argument-hint: "[feature-name]"
---

# Genesis Tasks to Issues

## Purpose

Convert the task breakdown for a feature into GitHub Issues for team coordination and external visibility. Each task becomes an issue with labels, dependencies, and metadata from the Genesis artifacts.

## Pre-flight

Read these files:
- `.genesis/tasks/{feature-name}/tasks.md` (REQUIRED — refuse if missing)
- `.genesis/specs/{feature-name}/spec.md`
- `.genesis/project-state.md`

Verify GitHub access:
- Check if `gh` CLI is available and authenticated
- If not, inform: "This command requires the GitHub CLI (`gh`). Install it and run `gh auth login` first."

## Process

1. **Determine feature name:**
   - If $ARGUMENTS provided, use it
   - If empty, check project-state.md for active feature
   - If no active feature, ask

2. **Parse the task list** and extract for each task:
   - Task ID and title → Issue title: `[T-{NNN}] {Title}`
   - Objective → Issue body
   - Acceptance criteria → Checklist in issue body
   - Complexity → Label: `complexity:small`, `complexity:medium`, `complexity:large`
   - Dependencies → Referenced in issue body
   - Task group → Label: `group:foundation`, `group:core`, `group:integration`, `group:testing`, `group:polish`
   - Constitution references → Mentioned in issue body

3. **Add standard metadata to each issue:**
   - Label: `genesis` (marks it as Genesis-managed)
   - Label: `feature:{feature-name}`
   - Body footer: link back to spec and plan files

4. **Preview before creating:**
   Present a summary table:
   ```
   Will create {N} GitHub Issues for feature '{feature-name}':

   | Task | Title | Labels | Dependencies |
   |------|-------|--------|-------------|
   | T-001 | {title} | complexity:small, group:foundation | None |
   | T-002 | {title} | complexity:medium, group:core | #T-001 |
   ```

   Ask: "Create these issues? (Issues can be closed later but not easily un-created.)"

5. **Create a GitHub Milestone** for the feature:
   - Use `gh api repos/{owner}/{repo}/milestones -f title="{feature-name}" -f description="Genesis feature: {feature spec overview}"`
   - If a milestone already exists for this feature, reuse it
   - All issues will be assigned to this milestone for progress tracking

6. **Generate a PR template** if one doesn't exist:
   - If `.github/pull_request_template.md` does not exist, create one:
     ```markdown
     ## Summary
     <!-- Brief description of changes -->

     ## Genesis Feature
     **Feature:** <!-- feature name -->
     **Spec:** `.genesis/specs/{feature}/spec.md`
     **Tasks:** <!-- list task IDs addressed by this PR -->

     ## Constitutional Compliance Checklist
     - [ ] Technology Stack (Section 2)
     - [ ] Architecture Principles (Section 3)
     - [ ] Code Standards (Section 4)
     - [ ] Testing Philosophy (Section 5)
     - [ ] Quality Gates (Section 6)

     ## Acceptance Criteria
     <!-- List the ACs this PR satisfies -->

     ## Review Notes
     <!-- Anything the reviewer should know -->
     ```

7. **Create issues** using `gh issue create`:
   - Create in dependency order so issue numbers can be cross-referenced
   - After each issue is created, note the GitHub issue number
   - Assign each issue to the feature milestone
   - Update issue bodies with actual issue number cross-references for dependencies

8. **Update tasks.md** with GitHub issue numbers:
   - Add `**Issue:** #{number}` to each task

9. **Present summary:**
   ```
   Created {N} GitHub Issues for '{feature-name}':
   - T-001 → #{issue-number}: {title}
   - T-002 → #{issue-number}: {title}
   ```

Git commit: `genesis: create issues for {feature-name}`

## Notes

- This command creates issues but does NOT close them. Issues are closed during `/genesis:implement` as tasks are completed.
- If issues already exist for some tasks (detected by `**Issue:**` field in tasks.md), skip those tasks and only create missing issues.
- Respect the repository's issue template if one exists.

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_issues` hooks and execute their instructions.
After completing: check for extensions with `after_issues` hooks and execute their instructions.
