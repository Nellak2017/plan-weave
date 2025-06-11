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
	// ✅ Step 1: Get environment variables
	err := godotenv.Load("internal/config/.env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// ✅ Step 2: Parse pgx Config
	cfg, err := pgx.ParseConfig(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Unable to parse DATABASE_URL: %v", err)
	}
	cfg.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	// ✅ Step 3: Open sql.DB using stdlib
	sqlDB := stdlib.OpenDB(*cfg)
	defer sqlDB.Close()

	// ✅ Step 4: Use sqlc's generated DB interface
	conn := db.New(sqlDB)

	// ✅ Step 5: Construct all services
	taskService := &app.TaskService{Q: conn}
	healthService := &app.HealthService{Q: conn}

	// ✅ Step 6: Construct all handlers
	taskHandler := &api.TaskHandler{Service: taskService}
	healthHandler := &api.HealthHandler{Service: healthService}

	// ✅ Step 7: Start the API
	log.Println("🚀 Plan Weave API running on :8080")
	http.ListenAndServe(":8080", api.NewRouter(taskHandler, healthHandler))
}
