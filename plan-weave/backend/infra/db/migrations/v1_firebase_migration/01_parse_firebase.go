package migrations

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
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
	for userID := range users {
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
		for _, task := range user.Collections.Tasks {
			err := writer.Write([]string{
				strconv.FormatInt(task.ID, 10),
				userID,
				task.Task,
				task.ParentThread,
				fmt.Sprintf("%.6f", task.Waste),
				fmt.Sprintf("%.6f", task.Ttc),
				fmt.Sprintf("%.6f", task.Efficiency),
				task.DueDate.Format(time.RFC3339),
				strconv.Itoa(int(task.Weight)),
				strconv.Itoa(int(task.CompletedTimeStamp)),
				task.Status,
				fmt.Sprintf("%.0f", task.Timestamp),
				fmt.Sprintf("%.6f", task.LiveTime),
				task.LiveTimeStamp.Format(time.RFC3339),
				strconv.FormatBool(task.Selected),
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
		for _, task := range user.Collections.Tasks {
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

func RunFirebaseParse() error {
	// Load the JSON dump
	rawJSON, err := os.ReadFile("./infra/db/migrations/v1_firebase_migration/firebase_raw.json")
	if err != nil {
		return fmt.Errorf("failed to read firebase JSON: %w", err)
	}

	var data core.FirebaseData
	err = json.Unmarshal(rawJSON, &data)
	if err != nil {
		return fmt.Errorf("failed to parse JSON: %w", err)
	}

	users := data.Collections.Users

	if err := WriteUsersCSV(users); err != nil {
		return fmt.Errorf("error writing users CSV: %w", err)
	}
	if err := WriteTasksCSV(users); err != nil {
		return fmt.Errorf("error writing tasks CSV: %w", err)
	}
	if err := WriteTaskDependenciesCSV(users); err != nil {
		return fmt.Errorf("error writing task dependencies CSV: %w", err)
	}

	return nil
}
