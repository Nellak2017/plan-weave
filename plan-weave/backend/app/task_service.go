// example service
package app

import (
	"context"

	db "github.com/Nellak2017/plan-weave/infra/db/generated"
	"github.com/google/uuid"
)

type TaskService struct {
	Q *db.Queries
}

func (s *TaskService) FetchTasks(ctx context.Context, userID uuid.UUID) ([]db.Task, error) {
	return s.Q.GetTasksByUserID(ctx, userID)
}
