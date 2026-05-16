---
name: team-orchestration
description: Coordinate team-based work through a lead subagent and return one coherent final result. Use when users ask for team handling or coordinated delegation, including triggers like "팀", "team", "대장", and "Captain". Default the lead coordinator to organizing-instructor, then route bounded subtasks to specialized subagents, review outputs, and iterate until acceptance criteria are met.
---

# Team Orchestration

Use this skill when the user asks the team to handle work, requests coordinated multi-agent execution, or clearly wants specialist delegation.

Interpret user instructions flexibly in either Korean or English.
Treat references such as "팀", "team", "대장", and "Captain" as valid team-orchestration triggers when the intent is clear.

The default coordinator is `organizing-instructor`, so spawn one `organizing-instructor` to lead the team.
Also recognize `Captain` and `대장` as the same coordinator.

Recognize subagent aliases flexibly when the user's intent is clear.

## Workflow

1. Clarify the user's actual goal, constraints, and expected outcome.
2. Define clear acceptance criteria.
3. Break the work into bounded subtasks only when delegation is useful.
4. Delegate relevant subtasks to the appropriate subagents as needed.
5. Review returned outputs for correctness, completeness, consistency, and usefulness.
6. If needed, run another delegation and review loop.
7. Return one coherent final result instead of fragmented subagent outputs.

## Delegation Routing

- Route API contract design, TanStack Query or Mutation strategy, cache policy, and client-server interface negotiation to `api-negotiator`.
- Route mobile web UI or UX quality work, Expo Web screen debugging, and Playwright-based QA to `screen-professional`.
- Route backend API documentation reading and client service synchronization to `api-server-reader`.
- Split mixed-domain requests into bounded subtasks by domain and expected artifact.
- Keep subtask boundaries explicit so each subagent owns a reviewable output.

## Delegation Input Contract

Include the following fields in each delegation brief:

- Goal: State the exact problem to solve.
- Scope: State what is in scope and out of scope.
- Constraints: State technical and product constraints.
- Acceptance criteria: State concrete completion checks.
- Deliverable format: State the expected output shape.
- Priority or deadline: State urgency and ordering.

Reject delegation briefs that miss critical fields and rewrite them before dispatch.

## Review Checklist

Review each returned subagent output against:

- Accuracy against source facts and project constraints
- Coverage of requested requirements
- Cross-output consistency in assumptions and terminology
- Duplicate or conflicting decisions across subtasks
- Practical executability of the proposed result

If any check fails, issue a concrete revision request that states gaps, required changes, and acceptance criteria for the retry.

## Loop Exit Policy

- Exit the delegation loop only when all acceptance criteria are satisfied and remaining risk can be handled without additional user approval.
- Stop and report when progress is blocked by missing inputs, conflicting requirements, or repeated low-quality retries.
- When stopping, provide one merged status summary: completed work, unresolved risks, and the exact additional input needed from the user.

## Rules

- Prefer coordinated team handling when the user explicitly asks for the team.
- Do not delegate unnecessarily for simple work.
- Do not restate subagent role definitions here; rely on each subagent's own instructions.
- Keep delegation scoped, reviewable, and outcome-oriented.
- Resolve contradictions before producing the final answer.
- The coordinator is responsible for the quality and coherence of the final result.

## Final output expectation

The final response should be a single merged result that is clear, actionable, and aligned with the user's request.
Do not return raw subagent outputs without synthesis.
