package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Nellak2017/plan-weave/api"
	"github.com/Nellak2017/plan-weave/app"
	db "github.com/Nellak2017/plan-weave/infra/db/generated"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("internal/config/.env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	databaseURL := os.Getenv("DATABASE_URL")

	// ✅ Step 1: Parse pgx Config
	cfg, err := pgx.ParseConfig(databaseURL)
	if err != nil {
		log.Fatalf("Unable to parse DATABASE_URL: %v", err)
	}

	// ✅ Step 2: Open sql.DB using stdlib
	sqlDB := stdlib.OpenDB(*cfg)
	defer sqlDB.Close()

	// ✅ Step 3: Use sqlc's generated DB interface
	queries := db.New(sqlDB)

	taskService := &app.TaskService{Q: queries}
	taskHandler := &api.TaskHandler{Service: taskService}

	r := api.NewRouter(taskHandler)

	log.Println("🚀 Plan Weave API running on :8080")
	http.ListenAndServe(":8080", r)
}
