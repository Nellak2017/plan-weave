package main

import (
	"fmt"
	"os"

	migrations "github.com/Nellak2017/plan-weave/infra/db/migrations/v1_firebase_migration"
)

func main() {
	if err := migrations.RunFirebaseParse(); err != nil {
		fmt.Fprintf(os.Stderr, "Migration failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Firebase data successfully converted to CSVs.")
}
