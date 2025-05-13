# Schema Changelog

## v1 - 2025-05-03
- Initial schema as used on Firebase in v1.0.0 Plan Weave release
- `Task` table: id, dependencies, task, selected, ttc, liveTime, dueDate (ISO), efficiency, parentThread, 
completedTimeStamp (epoch), timestamp (epoch), waste, eta, weight, status, liveTimeStamp (ISO)

## v2 - 2025-05-03
- `Task` table: Migrated `timestamp` from epoch (INT) to ISO8601 (TIMESTAMPTZ)
- `Task` table: Migrated `completedTimeStamp` from epoch (INT) to ISO8601 (TIMESTAMPTZ)