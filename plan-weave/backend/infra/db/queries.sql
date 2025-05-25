-- name: GetTaskByID :one
SELECT * FROM tasks WHERE id = $1;