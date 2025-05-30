-- name: GetTasksByUserID :many
SELECT *
FROM tasks
WHERE user_id = $1
LIMIT 1000;