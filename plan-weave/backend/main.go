package main

import (
	"context"
	"log"
	"os"
	"path/filepath"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	// if err := migrations.RunNewFirebaseParse(); err != nil {
	// 	fmt.Fprintf(os.Stderr, "Migration failed: %v\n", err)
	// 	os.Exit(1)
	// }
	// fmt.Println("Firebase data successfully converted to CSVs.")

	//Load the .env file
	err := godotenv.Load("internal/config/.env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Connect to Supabase DB
	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close(context.Background())

	// Load the schema.sql file
	schemaPath := filepath.Join(".", "infra", "db", "schema.sql")
	schemaBytes, err := os.ReadFile(schemaPath)
	if err != nil {
		log.Fatalf("Failed to read schema file: %v", err)
	}
	schemaSQL := string(schemaBytes)

	// Execute the schema SQL to create tables
	_, err = conn.Exec(context.Background(), schemaSQL)
	if err != nil {
		log.Fatalf("Failed to execute schema SQL: %v", err)
	}

	log.Println("✅ Tables successfully created in the remote database.")
}
