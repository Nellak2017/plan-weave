# Schema Changelog

## v1 - 2025-05-03
- Initial schema as used on Firebase in v1.0.0 Plan Weave release
- `Task` table: Added `id`, `dependencies`, `task`, `selected`, `ttc`, `liveTime`, `dueDate` (ISO), `efficiency`, `parentThread`, 
`completedTimeStamp` (epoch), `timestamp` (epoch), `waste`, `eta`, `weight`, `status`, `liveTimeStamp` (ISO)
- `Users` table: Added `user_id`, `username`
- `Task_Dependencies` table: Added `task_id`, `depends_on_task_id`

## v2 - 2025-05-23
- `Task` table: Deleted `completedTimeStamp` 
- `Task` table: Deleted `timestamp`
- `Task` table: Added `LastCompleteTime`, `LastIncompleteTime`, `IsLive`

## v3 - 2025-05-24
- `Task` table : Added `uuid`
- `Users` table : Added `uuid`