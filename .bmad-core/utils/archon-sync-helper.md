# archon-sync-helper

## Utility: Archon Story Sync Helper Functions

**Purpose**: Reusable helper functions for syncing BMAD stories with Archon MCP tasks.

**Usage**: Used by `sync-story-to-archon.md` task and BMAD dev agent during story development.

---

## Helper Functions

### 1. parseStoryFile(storyPath)

**Purpose**: Extract story metadata and tasks from markdown file.

**Input**:
```typescript
storyPath: string  // e.g., "docs/stories/5.6-financial-literacy-gamification.md"
```

**Output**:
```typescript
{
  story_title: string,        // "Story 5.6: Financial Literacy Gamification"
  story_number: string,       // "5.6"
  status: string,             // "Approved" | "Draft" | "In Progress" | etc.
  feature: string,            // "Gamification" (extracted from story context)
  acceptance_criteria: string[], // ["AC1", "AC2", ...]
  tasks: [
    {
      task_num: number,       // 1, 2, 3...
      task_title: string,     // "Gamification Page Layout"
      is_complete: boolean,   // true if checkbox is [x]
      subtasks: [
        {
          subtask_num: string,  // "1.1", "1.2"
          subtask_description: string,
          is_complete: boolean
        }
      ]
    }
  ]
}
```

**Parsing Logic**:

```markdown
# Regex Patterns
story_header: /^# Story ([\d\.]+): (.+)$/
status_line: /^## Status: (.+)$/
task_line: /^- \[([ x])\] \*\*Task (\d+): (.+?)\*\*/
subtask_line: /^  - \[([ x])\] ([\d\.]+): (.+)$/

# Feature Extraction
1. Check for "feature:" tag in story file
2. Check epic alignment in file header
3. Extract from task categories
4. Default to story number (e.g., "Story-5.6")
```

**Example**:
```javascript
const parsed = parseStoryFile("docs/stories/5.6-financial-literacy-gamification.md");
// Returns:
{
  story_title: "Story 5.6: Financial Literacy Gamification",
  story_number: "5.6",
  status: "Approved",
  feature: "Gamification",
  acceptance_criteria: ["AC1", "AC2", "AC3", "AC4", "AC5", "AC6"],
  tasks: [
    {
      task_num: 1,
      task_title: "Gamification Page Layout",
      is_complete: true,  // [x]
      subtasks: [...]
    },
    ...
  ]
}
```

---

### 2. createArchonTasksFromStory(parsedStory)

**Purpose**: Create Archon tasks for each main task in the parsed story.

**Input**:
```typescript
parsedStory: object  // Output from parseStoryFile()
```

**Output**:
```typescript
{
  success: boolean,
  created_tasks: [
    {
      archon_task_id: string,
      story_task_num: number,
      title: string,
      status: string
    }
  ],
  mapping: object  // Story-to-Archon mapping
}
```

**Implementation**:

```bash
For each task in parsedStory.tasks:
  1. Build task title: "Story {story_number} - Task {task_num}: {task_title}"
  2. Build description:
     """
     Story: {story_title}
     Acceptance Criteria: {AC list}

     Subtasks:
     {subtask list}

     Dev Notes: See story file for full context
     """
  3. Determine initial status:
     - If task.is_complete == true → status="done"
     - Else → status="todo"
  4. Create task via Archon MCP:
     manage_task(
       action="create",
       project_id="7a3602ff-1c55-46bc-8e9c-9f6712210606",
       title=task_title,
       description=task_description,
       status=initial_status,
       task_order=100 - task_num,
       feature=parsedStory.feature
     )
  5. Store mapping: task_num → archon_task_id
```

**Error Handling**:
- If manage_task fails → Log error, continue with next task
- If all tasks fail → Return {success: false, error: "..."}

---

### 3. updateArchonTaskStatus(taskMapping, taskNum, newStatus)

**Purpose**: Update Archon task status when story checkbox changes.

**Input**:
```typescript
taskMapping: object,  // Story-to-Archon mapping
taskNum: number,      // Story task number (1, 2, 3...)
newStatus: string     // "todo" | "doing" | "review" | "done"
```

**Output**:
```typescript
{
  success: boolean,
  archon_task_id: string,
  updated_status: string
}
```

**Implementation**:

```bash
1. Find archon_task_id from taskMapping using taskNum
2. Call Archon MCP:
   manage_task(
     action="update",
     task_id=archon_task_id,
     status=newStatus
   )
3. Update mapping file timestamp
4. Return result
```

**Status Mapping**:
- Story checkbox `[ ]` → Archon "todo"
- Story checkbox `[x]` → Archon "done"
- BMAD dev agent "in progress" → Archon "doing"
- BMAD dev agent "ready for review" → Archon "review"

---

### 4. getArchonTasksForStory(storyNumber)

**Purpose**: Retrieve all Archon tasks associated with a specific story.

**Input**:
```typescript
storyNumber: string  // e.g., "5.6"
```

**Output**:
```typescript
{
  success: boolean,
  tasks: [
    {
      id: string,
      title: string,
      status: string,
      task_order: number,
      feature: string
    }
  ]
}
```

**Implementation**:

```bash
1. Call Archon MCP:
   find_tasks(
     filter_by="project",
     filter_value="7a3602ff-1c55-46bc-8e9c-9f6712210606"
   )
2. Filter results where title contains "Story {storyNumber}"
3. Sort by task_order (descending)
4. Return filtered/sorted tasks
```

**Example**:
```javascript
const tasks = getArchonTasksForStory("5.6");
// Returns all tasks with title starting with "Story 5.6 -"
```

---

### 5. loadStoryArchonMapping(storyNumber)

**Purpose**: Load the story-to-Archon mapping from file.

**Input**:
```typescript
storyNumber: string  // e.g., "5.6"
```

**Output**:
```typescript
{
  story: string,            // Story file path
  story_number: string,
  archon_tasks: [
    {
      task_id: string,
      task_title: string,
      story_checkbox: string,
      subtasks: string[]
    }
  ],
  created_at: string,
  updated_at: string
}
```

**File Location**: `.bmad-core/data/story-archon-map-{storyNumber}.yaml`

**Example File** (`.bmad-core/data/story-archon-map-5.6.yaml`):
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
  - task_id: "98a9aef5-2328-4218-a9e9-0647885fd850"
    task_title: "Story 5.6 - Task 2: Points & Level Display"
    story_checkbox: "Task 2"
    subtasks:
      - "2.1: Create src/components/gamification/PointsLevelCard.tsx"
created_at: "2025-10-22T15:40:00Z"
updated_at: "2025-10-22T15:45:00Z"
```

**Implementation**:
```bash
1. Build file path: .bmad-core/data/story-archon-map-{storyNumber}.yaml
2. Read YAML file
3. Parse and return mapping object
4. If file not found → Return null
```

---

### 6. saveStoryArchonMapping(storyNumber, mapping)

**Purpose**: Save story-to-Archon mapping to file.

**Input**:
```typescript
storyNumber: string,
mapping: object  // Mapping structure (see example above)
```

**Output**:
```typescript
{
  success: boolean,
  file_path: string
}
```

**Implementation**:
```bash
1. Build file path: .bmad-core/data/story-archon-map-{storyNumber}.yaml
2. Add/update updated_at timestamp
3. Write mapping to YAML file
4. Return file path
```

---

### 7. syncStoryCheckboxToArchon(storyNumber, taskNum, isComplete)

**Purpose**: Sync a story checkbox change to Archon task status.

**Input**:
```typescript
storyNumber: string,  // "5.6"
taskNum: number,      // 1, 2, 3...
isComplete: boolean   // true if [x], false if [ ]
```

**Output**:
```typescript
{
  success: boolean,
  archon_task_id: string,
  new_status: string
}
```

**Implementation**:
```bash
1. Load mapping: loadStoryArchonMapping(storyNumber)
2. Find archon_task_id for taskNum
3. Determine new status:
   - isComplete == true → "done"
   - isComplete == false → "todo" (or keep existing if "doing"/"review")
4. Update Archon task:
   manage_task("update", task_id=archon_task_id, status=new_status)
5. Update mapping file timestamp
6. Return result
```

**Edge Cases**:
- If task already "doing" and checkbox unchecked → Keep "doing" (don't revert to "todo")
- If task "review" and checkbox unchecked → Keep "review"
- Only revert to "todo" if task was "done" or "todo"

---

## Usage Example (Full Workflow)

```javascript
// 1. Parse story file
const parsed = parseStoryFile("docs/stories/5.6-financial-literacy-gamification.md");

// 2. Create Archon tasks
const result = createArchonTasksFromStory(parsed);
console.log(`Created ${result.created_tasks.length} Archon tasks`);

// 3. Save mapping
saveStoryArchonMapping("5.6", result.mapping);

// 4. Later: User marks Task 2 checkbox as complete
syncStoryCheckboxToArchon("5.6", 2, true);
// → Updates Archon task to status="done"

// 5. Retrieve all tasks for story
const tasks = getArchonTasksForStory("5.6");
console.log(`Found ${tasks.tasks.length} tasks for Story 5.6`);
```

---

## Directory Structure

```
.bmad-core/
├── tasks/
│   └── sync-story-to-archon.md          # Main sync workflow
├── utils/
│   └── archon-sync-helper.md            # THIS FILE - Helper functions
└── data/
    ├── story-archon-map-5.6.yaml       # Mapping for Story 5.6
    ├── story-archon-map-6.1.yaml       # Mapping for Story 6.1
    └── ...
```

---

## Notes

- **Mapping files persist**: Even after story completion, mapping files remain for historical reference
- **Idempotent operations**: Running createArchonTasksFromStory() multiple times should check for duplicates
- **Error recovery**: All functions should gracefully handle Archon MCP unavailability
- **Logging**: All sync operations should log to `.ai/debug-log.md` for troubleshooting

---

## Related Files

- `sync-story-to-archon.md` - Uses these helper functions
- `.bmad-core/agents/dev.md` - Calls these during `*develop-story`
- `docs/archon_claude.md` - Documentation on Archon integration
