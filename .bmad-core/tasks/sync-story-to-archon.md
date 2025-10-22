# sync-story-to-archon

## Task: Sync BMAD Story to Archon Tasks

**Purpose**: Parse a BMAD story markdown file and create corresponding Archon MCP tasks for each checkbox task/subtask.

**When to use**: Called automatically at the start of `*develop-story` command OR manually when you want to sync story checkboxes to Archon task management.

---

## Prerequisites

- Archon MCP server connected
- Story file exists in `docs/stories/`
- Story file follows BMAD template format with Tasks/Subtasks checkboxes
- Previa project exists in Archon (ID: `7a3602ff-1c55-46bc-8e9c-9f6712210606`)

---

## Workflow

### Step 1: Parse Story File

Read the story file and extract:

```yaml
Story Information:
  - story_title: From "# Story X.X: [Title]" header
  - story_number: Story numbering (e.g., "5.6")
  - status: From "## Status: [Draft|Approved|In Progress|Ready for Review|Done]"
  - feature: From story context or epic alignment

Tasks Structure:
  - Main tasks: Lines starting with "- [ ]" or "- [x]" followed by **Task N:**
  - Subtasks: Lines starting with "  - [ ]" or "  - [x]" (indented)
  - Task format: "- [ ] **Task 1: Task Title** (AC: X, Y, Z)"
  - Subtask format: "  - [ ] 1.1: Subtask description"
```

**Example Parsing:**

```markdown
## Tasks / Subtasks

- [x] **Task 1: Gamification Page Layout** (AC: 1, 2, 3, 6)
  - [x] 1.1: Create `src/pages/Gamification.tsx` at `/dashboard/gamification` route
  - [x] 1.2: Grid layout for widgets (points, badges, challenges, tips)
  - [ ] 1.3: Responsive layout (stack on mobile)
```

**Parsed Output:**
- Main Task: "Task 1: Gamification Page Layout"
  - Subtask 1.1: "Create src/pages/Gamification.tsx at /dashboard/gamification route"
  - Subtask 1.2: "Grid layout for widgets"
  - Subtask 1.3: "Responsive layout (stack on mobile)"

---

### Step 2: Check Existing Archon Tasks

Before creating tasks, check if they already exist:

```bash
find_tasks(
  filter_by="project",
  filter_value="7a3602ff-1c55-46bc-8e9c-9f6712210606"
)
```

Search for tasks with matching:
- `title` contains story_title
- `feature` matches story feature

**Decision Logic:**
- If tasks exist → ASK USER: "Archon tasks found for this story. Recreate? (yes/no)"
- If user says "yes" → Delete old tasks, create new ones
- If user says "no" → Skip creation, use existing tasks
- If no tasks found → Create new tasks

---

### Step 3: Create Archon Tasks

For each **main task** in the story:

```bash
manage_task(
  action="create",
  project_id="7a3602ff-1c55-46bc-8e9c-9f6712210606",
  title="Story {story_number} - Task {task_num}: {task_title}",
  description="{full task description with acceptance criteria}",
  status="todo",
  task_order={100 - task_num},  # Task 1 = 100, Task 2 = 99, etc.
  feature="{story feature or epic alignment}"
)
```

**Task Title Format:**
- ✅ GOOD: "Story 5.6 - Task 1: Gamification Page Layout"
- ❌ BAD: "Task 1" (not searchable)

**Description Format:**
```
Story: Story 5.6: Financial Literacy Gamification
Acceptance Criteria: AC1, AC2, AC3, AC6

Subtasks:
- 1.1: Create src/pages/Gamification.tsx
- 1.2: Grid layout for widgets
- 1.3: Responsive layout (stack on mobile)

Dev Notes: See story file for full context
```

**Task Order Logic:**
- Highest priority = Task 1 (task_order: 100)
- Task 2 (task_order: 99)
- Task 3 (task_order: 98)
- Ensures tasks appear in correct order in Archon

---

### Step 4: Link Tasks to Story File

Create a mapping file at `.bmad-core/data/story-archon-map.yaml`:

```yaml
story: docs/stories/5.6-financial-literacy-gamification.md
story_number: "5.6"
archon_tasks:
  - task_id: "archon-uuid-1"
    task_title: "Story 5.6 - Task 1: Gamification Page Layout"
    story_checkbox: "Task 1"
    subtasks:
      - "1.1: Create src/pages/Gamification.tsx"
      - "1.2: Grid layout for widgets"
      - "1.3: Responsive layout"
  - task_id: "archon-uuid-2"
    task_title: "Story 5.6 - Task 2: Points & Level Display"
    story_checkbox: "Task 2"
created_at: "2025-10-22T15:40:00Z"
```

**Purpose**: Track relationship between story checkboxes and Archon tasks for bidirectional sync.

---

### Step 5: Confirm Creation

Display summary to user:

```
✅ Archon Tasks Created for Story 5.6

Created 9 tasks:
1. Story 5.6 - Task 1: Gamification Page Layout (task_order: 100)
2. Story 5.6 - Task 2: Points & Level Display (task_order: 99)
3. Story 5.6 - Task 3: Badge Showcase (task_order: 98)
... (7 more)

Feature: Gamification
Project: Previa (7a3602ff-1c55-46bc-8e9c-9f6712210606)

View tasks: find_tasks(filter_by="feature", filter_value="Gamification")
Start working: manage_task("update", task_id="...", status="doing")
```

---

## Usage Examples

### Manual Sync (Story Already Exists)

```bash
User: "Sync story 5.6 to Archon"
Claude: Runs sync-story-to-archon.md task
        Parses docs/stories/5.6-financial-literacy-gamification.md
        Creates 9 Archon tasks
        Displays summary
```

### Automatic Sync (During *develop-story)

```bash
User: "*develop-story @docs\stories\5.6-financial-literacy-gamification.md"
Claude:
  Step 0: Runs sync-story-to-archon.md
  Step 1-N: Implements tasks, updates both checkboxes AND Archon task status
```

---

## Status Sync Rules

### When Checkbox Marked [x] in Story:
1. Update corresponding Archon task to `status="done"`
2. Add completion timestamp to mapping file

### When Archon Task Marked "done":
1. Update story checkbox to `[x]`
2. Commit story file changes

**Bidirectional Sync**: Changes in either system update the other.

---

## Error Handling

### Story File Not Found
```
❌ Error: Story file not found at docs/stories/5.6-financial-literacy-gamification.md
Please check the file path and try again.
```

### Archon MCP Not Connected
```
❌ Error: Archon MCP server not available
Make sure Archon MCP is running and connected.
```

### Duplicate Tasks Found
```
⚠️ Warning: 9 Archon tasks already exist for Story 5.6
Recreate tasks? (yes/no): _
```

---

## File Locations

- **Story files**: `docs/stories/*.md`
- **Mapping file**: `.bmad-core/data/story-archon-map.yaml`
- **Archon project ID**: `7a3602ff-1c55-46bc-8e9c-9f6712210606`

---

## Notes

- **Subtasks NOT created**: Only main tasks are created in Archon. Subtasks stay as description text.
- **Checkbox state syncs**: When story checkbox changes, Archon task updates automatically
- **Manual updates**: You can always manually update Archon tasks with `manage_task()`
- **Mapping persistence**: The mapping file persists the relationship for future syncs

---

## Related Tasks

- `develop-story.md` - Uses this task at Step 0
- `archon-sync-helper.md` - Utility functions for sync operations
