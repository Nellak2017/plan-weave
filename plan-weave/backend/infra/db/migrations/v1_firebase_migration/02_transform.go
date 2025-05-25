// Converts the old schema in schema v1 to schema v2 (schema v1 -> v2)
// NOTE: since using a HOF or similar abstraction is too annoying to do in this language, I will violate DRY to keep it simple
package migrations

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"
)

// ---- Converts Firebase Dump JSON to V2 Go data structures (Explicit DRY violation)

// No new changes to users nor task dependencies

/*
Changes:

	Add:

	LastCompleteTime : ISO UTC+0 // default = today
	LastIncompleteTime : ISO UTC+0 // default = today
	IsLive : Bool // default = false
	UserId : UUID

	Delete:

	CompletedTimeStamp : epoch
	TimeStamp : epoch
	// possibly remove liveTimeStamp?
*/
func WriteNewTasksCSV(users map[string]FirebaseUser, userUUIDs map[string]string) error {
	file, err := os.Create("./infra/db/migrations/v1_firebase_migration/03_tasks.csv") // implicitly assumes it is called from main.go
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Writing CSV header for tasks table
	err = writer.Write([]string{
		"id", "user_id", "task", "parent_thread", "waste", "ttc", "efficiency",
		"due_date", "weight", "last_complete_time", "last_incomplete_time", "is_live", "status", "live_time",
		"live_time_stamp", "selected", "eta",
	})
	if err != nil {
		return err
	}

	// Writing tasks data
	for userID, user := range users {
		uid, ok := userUUIDs[userID]
		if !ok {
			return fmt.Errorf("UUID for user %s not found", userID)
		}
		for _, task := range user.Collections.Tasks {
			now := time.Now().UTC()
			err := writer.Write([]string{
				strconv.FormatInt(task.ID, 10),
				uid, // correct UUID from generated users
				task.Task,
				task.ParentThread,
				fmt.Sprintf("%.6f", task.Waste),
				fmt.Sprintf("%.6f", task.Ttc),
				fmt.Sprintf("%.6f", task.Efficiency),
				task.DueDate.Format(time.RFC3339),
				strconv.Itoa(int(task.Weight)),

				now.Format(time.RFC3339),  // LastCompleteTime
				now.Format(time.RFC3339),  // LastIncompleteTime
				strconv.FormatBool(false), // IsLive

				task.Status,
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

func RunNewFirebaseParse() error {
	// Load the JSON dump
	rawJSON, err := os.ReadFile("./infra/db/migrations/v1_firebase_migration/firebase_raw.json")
	if err != nil {
		return fmt.Errorf("failed to read firebase JSON: %w", err)
	}

	var data FirebaseData
	err = json.Unmarshal(rawJSON, &data)
	if err != nil {
		return fmt.Errorf("failed to parse JSON: %w", err)
	}

	users := data.Collections.Users

	userUUIDs, err := WriteUsersCSV(users)
	if err != nil {
		return fmt.Errorf("error writing users CSV: %w", err)
	}
	if err := WriteNewTasksCSV(users, userUUIDs); err != nil {
		return fmt.Errorf("error writing tasks CSV: %w", err)
	}
	if err := WriteTaskDependenciesCSV(users); err != nil {
		return fmt.Errorf("error writing task dependencies CSV: %w", err)
	}

	return nil
}
