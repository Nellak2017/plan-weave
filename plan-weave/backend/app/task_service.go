// example service
package app

import "github.com/Nellak2017/plan-weave/core"

type TaskRepo interface {
	GetByID(id int64) (*core.FirebaseTask, error)
}

type TaskService struct {
	Repo TaskRepo
}

func (s *TaskService) GetUser(id int64) (*core.FirebaseTask, error) {
	return s.Repo.GetByID(id)
}
