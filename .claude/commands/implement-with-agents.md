---
allowed-tools: Bash(git:*), Bash(ls:*)
description: Implement spec using Claude Code subagents
---

# Implementation mit Subagents

### Phase 1: Implementation  
- **swift-architect**: Execute implementation with: `/speckit.implement`
- **code-reviewer**: Review structural decisions in parallel

### Phase 2: Tests & Quality
- **swift-test-engineer**: Create and execute tests
- **qa-issue-validatore**: Final review of the issue and implementation

### Finalize ###
Create a descriptive commit message, push and create a PR