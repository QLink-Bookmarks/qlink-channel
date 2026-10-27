# Project Management Workflow

Requirements are settled in a GitHub Issue, stage and time are tracked in a GitHub Project, code and verification results live in the PR.

## Principles

- A work item is one user-completable feature or flow, never a single screen.
- Discussion happens in chat, confirmed results go in the Issue, code and verification go in the PR.
- The Issue body always holds only the latest confirmed version. Never record change rationale or superseded options; the discussion history stays in the chat session archive.
- Section 1 is written by the user. Sections 2-6 are written by the agent, each when that stage is confirmed.
- Never start the next stage before the user confirms the current one. Write the confirmed result into the Issue, report the stage is closed, and stop.

## Editing the Issue body

`gh issue edit <n> --body` replaces the whole body of that same issue. There is no partial edit, so always read the current body first, swap only the section being confirmed, and write the rest back byte-identical:

```
gh issue view <n> --json body -q .body > /tmp/body.md
# edit only the one section in /tmp/body.md
gh issue edit <n> --body-file /tmp/body.md
```

The user edits the body directly to attach images, so a blind full-body write destroys their uploads.

## Images

Never attach or link an image. Write only the filename, and let the user upload it in the browser:

- Format: `{issue#}_{sequence}_{title}`, e.g. `12_01_folder-empty.png`
- Sequence is two digits, restarting per issue. Title is lowercase kebab-case.
- This applies to both the Issue and the PR.

## Issue types

The organization has issue types enabled. `gh` cannot set them, so create the issue with `gh issue create` and then set the type with the GraphQL `updateIssue` mutation (`issueTypeId`); type ids come from `gh api orgs/<org>/issue-types`.

Each type has a default set of stages. Skipping is the default, not a rule: the user can ask for a skipped stage in chat.

| Type | 2 Requirement | 3 Design | 4 Test Criteria | 5 Breakdown | 6 PR |
|---|---|---|---|---|---|
| Feature | yes | yes | yes | yes | yes |
| Bug | reproduction steps and expected behavior | skip | yes, including the regression | skip | yes |
| Refactor | scope and what must not change | skip | yes, proving existing behavior holds | yes | yes |

## Stages

Stage names match the Project `Status` field exactly: `Requirement`, `Design`, `Test Criteria`, `Breakdown`, `Implementation`, `PR`, `Complete`.

| Status | Issue section | Agent | User |
|---|---|---|---|
| `Requirement` | 2 | Drafts detailed requirements from the user's request and repo context | Reviews in chat, confirms the final version |
| `Design` | 3 | Presents candidates as artifacts, per `references/design-candidates.md` | Reviews in chat, picks and confirms one |
| `Test Criteria` | 4 | Drafts pass/fail conditions, per `references/test-criteria.md` | Reviews in chat, confirms the final version |
| `Breakdown` | 5 | Writes the implementation spec and flow from sections 2-4 | — |
| `Implementation` | — | Implements and tests against the confirmed criteria | Instructs the agent to start |
| `PR` | 6 | Opens the PR, records actual test results in it, applies feedback | Reviews the PR |
| `Complete` | — | — | Merges the PR |

### 1. Request

The user writes `1. 기능 또는 문제 [USER]` roughly and gives the Issue number in chat. When the discussion started in chat instead, the agent drafts section 1 and opens the Issue itself.

### 2. Requirement

Read the repo for context before drafting. Cover the user goal, the end-to-end flow, per-screen behavior, loading / empty / error states, and the platform scope (web wide / web mobile / iOS).

Check the server only when the requirement depends on server behavior, and record the finding in the `서버 API` line:

1. Check `https://dev.api.archivelink.app/openapi` first.
2. If the endpoint is not there, check `http://localhost:8080/openapi`; if local is not running, write `local shutdown` and judge on the dev server alone.
3. If neither responds, write `API 확인 불가` and tell the user it is theirs to check.

The spec is large (~400KB); never read it whole. Fetch it and grep for the paths and schema names the feature needs. State plainly which endpoints exist, which are missing, and what has to be stubbed. A requirement that depends on a missing endpoint must say so before the user confirms it.

### 3. Design

Present candidates as artifacts in chat, never in the Issue. Once one is picked, write only the confirmed design into section 3: behavior and screen transitions as text, plus one image filename per capture with the state it must show. The user uploads the images onto those lines, so never rewrite section 3 afterwards.

### 4. Test Criteria

Conditions the user can walk through by hand to judge whether the feature works and is finished, without reading code. Draft them, review them with the user in chat, then write the confirmed list into section 4 as checkboxes.

### 5. Breakdown

The implementation spec: screens and components to build, data / API / state handling, and how the work splits. Follow the repo conventions already stated in `AGENTS.md`; do not restate them here. Split into several PRs only when one flow is too large to land at once.

### 6. PR

The PR body carries the linked Issue number (`Closes #12`) and the same checklist from section 4, with only the items actually verified checked off. Section 6 of the Issue records the PR link.

## Skipping sections

- Which stages a type skips by default is in the issue types table above.
- Confirm what to skip in chat. Mark a skipped section by keeping its heading and writing `(생략)`.
- `Requirement` (2) and `Test Criteria` (4) are never skipped.

## Resuming

The Issue body is the single source of truth for what is confirmed. Given only an Issue number, read the body, treat the last filled section as the completed stage, and ask the user to confirm the next one. Never re-open a stage the body already records as confirmed.
