# GitHub Issue Contexts

This directory contains context files for GitHub issues to help track implementation details, agent assignments, and progress.

## Context Files

### Active Issues

- **context-10.md** - Enhance Dashboard: Add Photo Statistics Widgets and Photo Table
  - Type: Enhancement
  - Priority: High (P1)
  - Status: Open
  - Estimated Effort: L (~10 hours)
  - Created: 2025-11-16

## File Naming Convention

Context files follow the pattern: `context-#{issue_number}.md`

Example: `context-10.md` corresponds to GitHub issue #10

## Context File Structure

Each context file includes:
1. **Issue Summary** - Basic metadata (title, type, priority, status, assignee, dates)
2. **Requirements Analysis** - Core objectives, acceptance criteria, technical constraints
3. **Implementation Strategy** - Complexity assessment, agent assignments, context distribution
4. **Progress Tracking** - Phase completion checklist and timeline
5. **Agent Communication Log** - Updates from assigned agents

## Usage

### For Developers
- Read the context file before starting work on an issue
- Update progress tracking after completing each phase
- Add notes to the communication log with findings or blockers

### For Planning
- Context files are auto-generated when issues are created
- Agent assignments are based on issue type and priority
- Implementation phases are defined upfront for clear workflow

### For Review
- Review agents use context files to verify acceptance criteria
- Code quality standards are documented in each context
- Testing requirements are explicitly listed

## Integration with GitHub

Context files complement GitHub issues but are NOT a replacement:
- GitHub issues: User-facing requirements and discussion
- Context files: Developer-facing implementation guidance and tracking

Both should be kept in sync when requirements change.
