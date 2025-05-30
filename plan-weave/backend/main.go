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

	// ✅ Step 1: Parse pgx Config
	cfg, err := pgx.ParseConfig(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Unable to parse DATABASE_URL: %v", err)
	}
	cfg.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	// ✅ Step 2: Open sql.DB using stdlib
	sqlDB := stdlib.OpenDB(*cfg)
	defer sqlDB.Close()

	// ✅ Step 3: Use sqlc's generated DB interface
	log.Println("🚀 Plan Weave API running on :8080")
	http.ListenAndServe(":8080", api.NewRouter(&api.TaskHandler{Service: &app.TaskService{Q: db.New(sqlDB)}}))
}
