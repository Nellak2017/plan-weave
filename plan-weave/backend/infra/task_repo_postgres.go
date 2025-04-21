// Infra basic example
package infra

import (
	"database/sql"

	"github.com/Nellak2017/plan-weave/core"
)

type PostgresUserRepo struct {
	DB *sql.DB
}

func (r *PostgresUserRepo) GetByID(id int64) (*core.Task, error) {
	return &core.Task{ID: id, Task: "Example task", TTC: 1}, nil
}
