package app

import (
	"context"

	db "github.com/Nellak2017/plan-weave/infra/db/generated"
)

type HealthService struct {
	Q *db.Queries
}

func (s *HealthService) CheckDatabase(ctx context.Context) error {
	_, err := s.Q.PingDB(ctx)
	return err
}
