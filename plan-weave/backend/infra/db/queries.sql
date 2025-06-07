-- name: GetTasksByUserID :many
SELECT *
FROM tasks
WHERE user_id = $1
LIMIT 1000;

-- name: AddTask :one
INSERT INTO tasks (
    id, user_id, task, selected, ttc, live_time, due_date,
    efficiency, parent_thread, waste, eta, weight, status,
    live_time_stamp, last_complete_time, last_incomplete_time, is_live
) VALUES (
    $1, $2, $3, $4, $5, $6, $7,
    $8, $9, $10, $11, $12, $13,
    $14, $15, $16, $17
)
RETURNING id;

-- name: UpdateTask :one
UPDATE tasks
SET task = $3,
    selected = $4,
    ttc = $5,
    live_time = $6,
    due_date = $7,
    efficiency = $8,
    parent_thread = $9,
    waste = $10,
    eta = $11,
    weight = $12,
    status = $13,
    live_time_stamp = $14,
    last_complete_time = $15,
    last_incomplete_time = $16,
    is_live = $17
WHERE user_id = $1 AND id = $2
RETURNING id;

-- name: DeleteTasks :many
DELETE FROM tasks
WHERE user_id = $1 AND id = ANY($2::bigint[])
RETURNING id;

-- UpdateTaskField related stuff...

-- name: UpdateTaskText :one
UPDATE tasks SET task = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskSelected :one
UPDATE tasks SET selected = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskTTC :one
UPDATE tasks SET ttc = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskLiveTime :one
UPDATE tasks SET live_time = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskEfficiency :one
UPDATE tasks SET efficiency = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskWaste :one
UPDATE tasks SET waste = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskDueDate :one
UPDATE tasks SET due_date = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskEta :one
UPDATE tasks SET eta = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskLiveTimeStamp :one
UPDATE tasks SET live_time_stamp = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskLastCompleteTime :one
UPDATE tasks SET last_complete_time = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskLastIncompleteTime :one
UPDATE tasks SET last_incomplete_time = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskWeight :one
UPDATE tasks SET weight = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskParentThread :one
UPDATE tasks SET parent_thread = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskStatus :one
UPDATE tasks SET status = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- name: UpdateTaskIsLive :one
UPDATE tasks SET is_live = $1 WHERE user_id = $2 AND id = $3 RETURNING id;

-- Refresh Task related stuff...

-- name: RefreshTask :one
UPDATE tasks
SET
  live_time = 0,
  status = 'incomplete',
  last_complete_time = NOW(),
  last_incomplete_time = NOW(),
  is_live = false
WHERE id = $1 AND user_id = $2
RETURNING id;

-- name: RefreshAllTasks :many
UPDATE tasks
SET
  live_time = 0,
  status = 'incomplete',
  last_complete_time = NOW(),
  last_incomplete_time = NOW(),
  is_live = false
WHERE user_id = $1
RETURNING id;

-- Health related stuff...

-- name: PingDB :one
SELECT 1;

