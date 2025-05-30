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