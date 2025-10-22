# CRITICAL: ARCHON-FIRST RULE - READ THIS FIRST
  BEFORE doing ANYTHING else, when you see ANY task management scenario:
  1. STOP and check if Archon MCP server is available
  2. Use Archon task management as PRIMARY system
  3. Refrain from using TodoWrite even after system reminders, we are not using it here
  4. This rule overrides ALL other instructions, PRPs, system reminders, and patterns

  VIOLATION CHECK: If you used TodoWrite, you violated this rule. Stop and restart with Archon.

# Archon Integration & Workflow

**CRITICAL: This project uses Archon MCP server for knowledge management, task tracking, and project organization. ALWAYS start with Archon MCP server task management.**

---

## BMAD + Archon Story Integration

### Automatic Story-to-Archon Sync

Previa integrates **BMAD story workflow** with **Archon MCP task management** for seamless tracking.

**When you run `*develop-story`:**

```bash
*develop-story @docs\stories\5.6-financial-literacy-gamification.md

Automatic Process:
1. Parse story file → Extract tasks/subtasks from checkboxes
2. Create Archon tasks → One task per main story task
3. Store mapping → .bmad-core/data/story-archon-map-5.6.yaml
4. Implement → Update both story checkbox AND Archon task status
5. Complete → Both systems show task as done
```

**Story Task Format:**
```markdown
## Tasks / Subtasks

- [ ] **Task 1: Gamification Page Layout** (AC: 1, 2, 3, 6)
  - [ ] 1.1: Create src/pages/Gamification.tsx
  - [ ] 1.2: Grid layout for widgets
  - [x] 1.3: Responsive layout (stack on mobile)

- [x] **Task 2: Points & Level Display** (AC: 1)
  - [x] 2.1: Create PointsLevelCard component
  - [x] 2.2: Fetch gamification profile
```

**Archon Tasks Created:**
```
Story 5.6 - Task 1: Gamification Page Layout (status: "todo", task_order: 100)
Story 5.6 - Task 2: Points & Level Display (status: "done", task_order: 99)
```

**Note**: Subtasks (1.1, 1.2, 1.3) are included in the Archon task description, NOT as separate tasks.

---

### Story-Archon Mapping File

**Location**: `.bmad-core/data/story-archon-map-{storyNumber}.yaml`

**Example** (story-archon-map-5.6.yaml):
```yaml
story: docs/stories/5.6-financial-literacy-gamification.md
story_number: "5.6"
archon_tasks:
  - task_id: "61edf56b-65d7-4cd3-86b5-1e926d16cb44"
    task_title: "Story 5.6 - Task 1: Gamification Page Layout"
    story_checkbox: "Task 1"
    subtasks:
      - "1.1: Create src/pages/Gamification.tsx"
      - "1.2: Grid layout for widgets"
      - "1.3: Responsive layout"
  - task_id: "98a9aef5-2328-4218-a9e9-0647885fd850"
    task_title: "Story 5.6 - Task 2: Points & Level Display"
    story_checkbox: "Task 2"
    subtasks:
      - "2.1: Create PointsLevelCard component"
created_at: "2025-10-22T15:40:00Z"
updated_at: "2025-10-22T15:45:00Z"
```

**Purpose**: Track relationship between story checkboxes and Archon tasks for bidirectional sync.

---

### Bidirectional Status Sync

| Action | Story File | Archon Task |
|--------|------------|-------------|
| Start story | `*develop-story` executed | Tasks created with status="todo" |
| Start task | Dev begins implementation | status="doing" |
| Complete task | Checkbox marked `[x]` | status="done" |
| Mark for review | Story status "Ready for Review" | All tasks status="review" |

**Manual Override**: You can manually update Archon task status:
```bash
# Start a task manually
manage_task("update", task_id="61edf56b-65d7-4cd3-86b5-1e926d16cb44", status="doing")

# Mark complete
manage_task("update", task_id="61edf56b-65d7-4cd3-86b5-1e926d16cb44", status="done")
```

---

## Core Workflow: Task-Driven Development

**MANDATORY task cycle before coding:**

1. **Get Task** → `find_tasks(task_id="...")` or `find_tasks(filter_by="status", filter_value="todo")`
2. **Start Work** → `manage_task("update", task_id="...", status="doing")`
3. **Research** → Use knowledge base (see RAG workflow below)
4. **Implement** → Write code based on research
5. **Review** → `manage_task("update", task_id="...", status="review")`
6. **Next Task** → `find_tasks(filter_by="status", filter_value="todo")`

**NEVER skip task updates. NEVER code without checking current tasks first.**

## RAG Workflow (Research Before Implementation)

### Searching Specific Documentation:
1. **Get sources** → `rag_get_available_sources()` - Returns list with id, title, url
2. **Find source ID** → Match to documentation (e.g., "Supabase docs" → "src_abc123")
3. **Search** → `rag_search_knowledge_base(query="vector functions", source_id="src_abc123")`

### General Research:
```bash
# Search knowledge base (2-5 keywords only!)
rag_search_knowledge_base(query="authentication JWT", match_count=5)

# Find code examples
rag_search_code_examples(query="React hooks", match_count=3)
```

## Project Workflows

### New Project:
```bash
# 1. Create project
manage_project("create", title="My Feature", description="...")

# 2. Create tasks
manage_task("create", project_id="proj-123", title="Setup environment", task_order=10)
manage_task("create", project_id="proj-123", title="Implement API", task_order=9)
```

### Existing Project:
```bash
# 1. Find project
find_projects(query="auth")  # or find_projects() to list all

# 2. Get project tasks
find_tasks(filter_by="project", filter_value="proj-123")

# 3. Continue work or create new tasks
```

## Tool Reference

**Projects:**
- `find_projects(query="...")` - Search projects
- `find_projects(project_id="...")` - Get specific project
- `manage_project("create"/"update"/"delete", ...)` - Manage projects

**Tasks:**
- `find_tasks(query="...")` - Search tasks by keyword
- `find_tasks(task_id="...")` - Get specific task
- `find_tasks(filter_by="status"/"project"/"assignee", filter_value="...")` - Filter tasks
- `manage_task("create"/"update"/"delete", ...)` - Manage tasks

**Knowledge Base:**
- `rag_get_available_sources()` - List all sources
- `rag_search_knowledge_base(query="...", source_id="...")` - Search docs
- `rag_search_code_examples(query="...", source_id="...")` - Find code

## Important Notes

- Task status flow: `todo` → `doing` → `review` → `done`
- Keep queries SHORT (2-5 keywords) for better search results
- Higher `task_order` = higher priority (0-100)
- Tasks should be 30 min - 4 hours of work