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

func (s *TaskService) AddTask(ctx context.Context, task db.Task) (int64, error) {
	return s.Q.AddTask(ctx, db.AddTaskParams(task))
}

func (s *TaskService) UpdateTask(ctx context.Context, userID uuid.UUID, task db.Task) (int64, error) {
	params := db.UpdateTaskParams{
		UserID:             task.UserID,
		ID:                 task.ID,
		Task:               task.Task,
		Selected:           task.Selected,
		Ttc:                task.Ttc,
		LiveTime:           task.LiveTime,
		DueDate:            task.DueDate,
		Efficiency:         task.Efficiency,
		ParentThread:       task.ParentThread,
		Waste:              task.Waste,
		Eta:                task.Eta,
		Weight:             task.Weight,
		Status:             task.Status,
		LiveTimeStamp:      task.LiveTimeStamp,
		LastCompleteTime:   task.LastCompleteTime,
		LastIncompleteTime: task.LastIncompleteTime,
		IsLive:             task.IsLive,
	}
	return s.Q.UpdateTask(ctx, params)
}

func (s *TaskService) DeleteTasks(ctx context.Context, userID uuid.UUID, taskIDs []int64) ([]int64, error) {
	params := db.DeleteTasksParams{
		UserID:  userID,
		Column2: taskIDs,
	}
	return s.Q.DeleteTasks(ctx, params)
}
