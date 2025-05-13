package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/Nellak2017/plan-weave/core"
	migrations "github.com/Nellak2017/plan-weave/infra/db/migrations/v1_firebase_migration"
)

func main() {
	// Your raw JSON data (replace with actual JSON loading code)
	rawJSON, err := os.ReadFile("./infra/db/migrations/v1_firebase_migration/firebase_raw.json") //at ./infra/db/migrations/v1_firebase_migration/firebase_raw.json
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return
	}

	// fmt.Println("Raw JSON:", string(rawJSON))

	// Parse the raw JSON
	var data core.FirebaseData
	err = json.Unmarshal(rawJSON, &data)
	if err != nil {
		fmt.Println("Error unmarshaling JSON:", err)
		return
	}

	fmt.Println("Parsed Users:", data.Collections.Users)

	// Write CSV files
	err = migrations.WriteUsersCSV(data.Collections.Users)
	if err != nil {
		fmt.Println("Error writing users CSV:", err)
		return
	}
	fmt.Println("Users CSV file written successfully!")

	// err = migrations.WriteTasksCSV(data.Users)
	// if err != nil {
	// 	fmt.Println("Error writing tasks CSV:", err)
	// 	return
	// }
	// fmt.Println("Tasks CSV file written successfully!")

	// err = migrations.WriteTaskDependenciesCSV(data.Users)
	// if err != nil {
	// 	fmt.Println("Error writing task dependencies CSV:", err)
	// 	return
	// }
	// fmt.Println("Task Dependencies CSV file written successfully!")
	// fmt.Println("------------------------------------------------")
	// fmt.Println("CSV files written successfully!")
}
