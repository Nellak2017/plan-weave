package app

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"
	"time"

	db "github.com/Nellak2017/plan-weave/infra/db/generated"
	"github.com/google/uuid"
)

type TaskService struct {
	Q *db.Queries
}

func (s *TaskService) FetchTasks(ctx context.Context, userID uuid.UUID) ([]db.GetTasksByUserIDRow, error) {
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

func (s *TaskService) UpdateTaskField(ctx context.Context, userID uuid.UUID, taskID int64, field string, value string) (int64, error) {
	// --- Reduce some boilerplate
	q := s.Q
	// --- Helper HOF to reduce cognitive complexity from 25 to less than 15
	parseFloatAndCall := func(value string, f func(float64) (int64, error)) (int64, error) {
		v, err := strconv.ParseFloat(value, 64)
		if err != nil {
			return 0, fmt.Errorf("invalid float: %w", err)
		}
		return f(v)
	}
	parseBoolAndCall := func(value string, f func(bool) (int64, error)) (int64, error) {
		v, err := strconv.ParseBool(value)
		if err != nil {
			return 0, fmt.Errorf("invalid boolean: %w", err)
		}
		return f(v)
	}
	parseIntAndCall := func(value string, f func(int32) (int64, error)) (int64, error) {
		v, err := strconv.Atoi(value)
		if err != nil {
			return 0, fmt.Errorf("invalid int: %w", err)
		}
		return f(int32(v))
	}
	parseTimeAndCall := func(value string, f func(time.Time) (int64, error)) (int64, error) {
		v, err := time.Parse(time.RFC3339, value)
		if err != nil {
			return 0, fmt.Errorf("invalid timestamp: %w", err)
		}
		return f(v)
	}
	parseNullTimeAndCall := func(value string, f func(sql.NullTime) (int64, error)) (int64, error) {
		v, err := time.Parse(time.RFC3339, value)
		if err != nil {
			return 0, fmt.Errorf("invalid timestamp: %w", err)
		}
		return f(sql.NullTime{Time: v, Valid: true})
	}
	// --- Map of how to handle updating each field
	fieldHandlers := map[string]func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error){
		"task": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return q.UpdateTaskText(ctx, db.UpdateTaskTextParams{Task: value, UserID: userID, ID: taskID})
		},
		"selected": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseBoolAndCall(value, func(b bool) (int64, error) {
				return q.UpdateTaskSelected(ctx, db.UpdateTaskSelectedParams{Selected: b, UserID: userID, ID: taskID})
			})
		},
		"ttc": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseFloatAndCall(value, func(f float64) (int64, error) {
				return q.UpdateTaskTTC(ctx, db.UpdateTaskTTCParams{Ttc: f, UserID: userID, ID: taskID})
			})
		},
		"liveTime": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseFloatAndCall(value, func(f float64) (int64, error) {
				return q.UpdateTaskLiveTime(ctx, db.UpdateTaskLiveTimeParams{LiveTime: f, UserID: userID, ID: taskID})
			})
		},
		"dueDate": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseTimeAndCall(value, func(t time.Time) (int64, error) {
				return q.UpdateTaskDueDate(ctx, db.UpdateTaskDueDateParams{DueDate: t, UserID: userID, ID: taskID})
			})
		},
		"efficiency": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseFloatAndCall(value, func(f float64) (int64, error) {
				return q.UpdateTaskEfficiency(ctx, db.UpdateTaskEfficiencyParams{Efficiency: f, UserID: userID, ID: taskID})
			})
		},
		"parentThread": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return q.UpdateTaskParentThread(ctx, db.UpdateTaskParentThreadParams{ParentThread: value, UserID: userID, ID: taskID})
		},
		"waste": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseFloatAndCall(value, func(f float64) (int64, error) {
				return q.UpdateTaskWaste(ctx, db.UpdateTaskWasteParams{Waste: f, UserID: userID, ID: taskID})
			})
		},
		"eta": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseTimeAndCall(value, func(t time.Time) (int64, error) {
				return q.UpdateTaskEta(ctx, db.UpdateTaskEtaParams{Eta: t, UserID: userID, ID: taskID})
			})
		},
		"weight": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseIntAndCall(value, func(i int32) (int64, error) {
				return q.UpdateTaskWeight(ctx, db.UpdateTaskWeightParams{Weight: i, UserID: userID, ID: taskID})
			})
		},
		"status": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return q.UpdateTaskStatus(ctx, db.UpdateTaskStatusParams{Status: value, UserID: userID, ID: taskID})
		},
		"liveTimeStamp": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseNullTimeAndCall(value, func(t sql.NullTime) (int64, error) {
				return q.UpdateTaskLiveTimeStamp(ctx, db.UpdateTaskLiveTimeStampParams{LiveTimeStamp: t, UserID: userID, ID: taskID})
			})
		},
		"lastCompleteTime": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseTimeAndCall(value, func(t time.Time) (int64, error) {
				return q.UpdateTaskLastCompleteTime(ctx, db.UpdateTaskLastCompleteTimeParams{LastCompleteTime: t, UserID: userID, ID: taskID})
			})
		},
		"lastIncompleteTime": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseTimeAndCall(value, func(t time.Time) (int64, error) {
				return q.UpdateTaskLastIncompleteTime(ctx, db.UpdateTaskLastIncompleteTimeParams{LastIncompleteTime: t, UserID: userID, ID: taskID})
			})
		},
		"isLive": func(ctx context.Context, userID uuid.UUID, taskID int64, value string) (int64, error) {
			return parseBoolAndCall(value, func(b bool) (int64, error) {
				return q.UpdateTaskIsLive(ctx, db.UpdateTaskIsLiveParams{IsLive: b, UserID: userID, ID: taskID})
			})
		},
	}
	// --- Update the given field or show unsupported field error
	handler, ok := fieldHandlers[field]
	if !ok {
		return 0, fmt.Errorf("unsupported field: %s", field)
	}
	return handler(ctx, userID, taskID, value)
}

func (s *TaskService) DeleteTasks(ctx context.Context, userID uuid.UUID, taskIDs []int64) ([]int64, error) {
	params := db.DeleteTasksParams{
		UserID:  userID,
		Column2: taskIDs,
	}
	return s.Q.DeleteTasks(ctx, params)
}

func (s *TaskService) AddTaskDependencies(ctx context.Context, taskID int64, userID uuid.UUID, dependencies []int64) ([]int64, error) {
	if len(dependencies) == 0 {
		return nil, nil
	}

	// Step 1: Get valid task IDs for the user
	tasks, err := s.Q.GetTasksByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	validIDs := make(map[int64]struct{}, len(tasks))
	for _, task := range tasks {
		validIDs[task.ID] = struct{}{}
	}

	// Step 2: Filter out invalid/self dependencies
	filtered := make([]int64, 0, len(dependencies))
	for _, dep := range dependencies {
		if dep == taskID {
			continue
		}
		if _, ok := validIDs[dep]; ok {
			filtered = append(filtered, dep)
		}
	}

	if len(filtered) == 0 {
		return nil, nil
	}

	// Step 3: Call SQLc method with params struct
	return s.Q.AddTaskDependencies(ctx, db.AddTaskDependenciesParams{
		TaskID:  taskID,
		Column2: filtered,
	})
}

func (s *TaskService) IsTaskOwnedByUser(ctx context.Context, taskID int64, userID uuid.UUID) (bool, error) {
	_, err := s.Q.IsTaskOwnedByUser(ctx, db.IsTaskOwnedByUserParams{
		ID:     taskID,
		UserID: userID,
	})
	if err == sql.ErrNoRows {
		return false, nil
	}
	return err == nil, err
}

func (s *TaskService) DeleteTaskDependencies(ctx context.Context, taskID int64, deps []int64) ([]int64, error) {
	return s.Q.DeleteTaskDependencies(ctx, db.DeleteTaskDependenciesParams{
		TaskID:  taskID,
		Column2: deps,
	})
}

func (s *TaskService) ClearTaskDependencies(ctx context.Context, taskID int64) (int64, error) {
	return s.Q.ClearTaskDependencies(ctx, taskID)
}

func (s *TaskService) RefreshTask(ctx context.Context, userID uuid.UUID, taskID int64) (int64, error) {
	return s.Q.RefreshTask(ctx, db.RefreshTaskParams{ID: taskID, UserID: userID})
}

func (s *TaskService) RefreshAllTasks(ctx context.Context, userID uuid.UUID) ([]int64, error) {
	return s.Q.RefreshAllTasks(ctx, userID)
}
func (s *TaskService) UpdateTaskEta(ctx context.Context, eta time.Time, userID uuid.UUID, taskID int64) error {
	_, err := s.Q.UpdateTaskEta(ctx, db.UpdateTaskEtaParams{
		Eta:    eta,
		UserID: userID,
		ID:     taskID,
	})
	return err
}

func (s *TaskService) UpdateAllTaskEtas(ctx context.Context, eta time.Time, userID uuid.UUID) ([]int64, error) {
	return s.Q.UpdateAllTaskEtasForUser(ctx, db.UpdateAllTaskEtasForUserParams{
		Eta:    eta,
		UserID: userID,
	})
}
