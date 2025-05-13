package migrations

import (
	"encoding/csv"
	"fmt"
	"os"
	"time"

	"github.com/Nellak2017/plan-weave/core"
)

// Converts Firebase Dump JSON to Go data structures
func WriteUsersCSV(users map[string]core.FirebaseUser) error {
	file, err := os.Create("./infra/db/migrations/v1_firebase_migration/03_users.csv") // implicitly assumes it is called from main.go
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Writing CSV header for users table
	err = writer.Write([]string{"user_id", "username"})
	if err != nil {
		return err
	}

	// Writing users data
	for userID, _ := range users {
		// You can add user-specific fields here (for now, just user_id)
		err := writer.Write([]string{userID, userID})
		if err != nil {
			return err
		}
	}

	return nil
}

func WriteTasksCSV(users map[string]core.FirebaseUser) error {
	file, err := os.Create("./infra/db/migrations/v1_firebase_migration/03_tasks.csv") // implicitly assumes it is called from main.go
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Writing CSV header for tasks table
	err = writer.Write([]string{
		"task_id", "user_id", "task", "parentThread", "waste", "ttc", "efficiency",
		"dueDate", "weight", "completedTimeStamp", "status", "timestamp", "liveTime",
		"liveTimeStamp", "selected", "eta",
	})
	if err != nil {
		return err
	}

	// Writing tasks data
	for userID, user := range users {
		for _, task := range user.Tasks {
			taskIDStr := fmt.Sprintf("%d", task.ID)
			err := writer.Write([]string{
				taskIDStr, userID, task.Task, task.ParentThread, fmt.Sprintf("%f", task.Waste),
				fmt.Sprintf("%d", task.Ttc), fmt.Sprintf("%f", task.Efficiency),
				task.DueDate.Format(time.RFC3339), fmt.Sprintf("%d", task.Weight),
				fmt.Sprintf("%d", task.CompletedTimeStamp), task.Status,
				fmt.Sprintf("%d", task.Timestamp), fmt.Sprintf("%d", task.LiveTime),
				task.LiveTimeStamp.Format(time.RFC3339), fmt.Sprintf("%v", task.Selected),
				task.Eta.Format(time.RFC3339),
			})
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func WriteTaskDependenciesCSV(users map[string]core.FirebaseUser) error {
	file, err := os.Create("./infra/db/migrations/v1_firebase_migration/03_task_dependencies.csv") // implicitly assumes it is called from main.go
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Writing CSV header for task dependencies table
	err = writer.Write([]string{"task_id", "depends_on_task_id"})
	if err != nil {
		return err
	}

	// Writing task dependencies data
	for _, user := range users {
		for _, task := range user.Tasks {
			taskIDStr := fmt.Sprintf("%d", task.ID)
			// Writing dependencies
			for _, dep := range task.Dependencies {
				err := writer.Write([]string{taskIDStr, fmt.Sprintf("%d", dep.Value)})
				if err != nil {
					return err
				}
			}
		}
	}

	return nil
}
