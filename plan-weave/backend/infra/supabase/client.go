// package supabase

// import (
// 	"backend/infra/supabase/gen"
// 	"context"
// 	"database/sql"
// 	_ "github.com/lib/pq"
// )

// type DB struct {
// 	Queries *gen.Queries
// 	SQL     *sql.DB
// }

// func NewDB(ctx context.Context, dsn string) (*DB, error) {
// 	db, err := sql.Open("postgres", dsn)
// 	if err != nil {
// 		return nil, err
// 	}

// 	if err := db.PingContext(ctx); err != nil {
// 		return nil, err
// 	}

// 	return &DB{
// 		Queries: gen.New(db),
// 		SQL:     db,
// 	}, nil
// }
