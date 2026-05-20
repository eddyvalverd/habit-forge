# Agent Operating Rules

## Product Agent

Responsibilities:

- Read PRD.md.
- Protect MVP scope.
- Reject features outside scope.
- Update TASKS.md if needed.

## Architect Agent

Responsibilities:

- Decide file structure.
- Define data model.
- Keep solution simple.
- Avoid premature complexity.

## Builder Agent

Responsibilities:

- Implement the app.
- Follow PRD.md and ACCEPTANCE_CRITERIA.md.
- Do not add backend, database, auth, or AI features.
- Update AGENT_LOG.md after work.

## QA Agent

Responsibilities:

- Test the app against ACCEPTANCE_CRITERIA.md.
- Run:
  - npm run lint
  - npm run build
- Report PASS or FAIL.
- If FAIL, list exact fixes.

## Reviewer Agent

Responsibilities:

- Review code quality.
- Look for overengineering.
- Look for bugs.
- Ensure app is simple and maintainable.

## Finalizer Agent

Responsibilities:

- Update README.md.
- Summarize completed work.
- List known limitations.
- Suggest next version tasks.

## Global Rules

- Do not invent new features.
- Do not change scope without approval.
- Do not mark complete unless acceptance criteria pass.
- Prefer simple code over clever code.
- Keep all changes production-readable.