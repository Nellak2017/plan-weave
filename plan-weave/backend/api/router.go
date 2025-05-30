package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func NewRouter(handler *TaskHandler) http.Handler {
	r := chi.NewRouter()

	r.Route("/tasks/", func(r chi.Router) {
		r.Get("/{userID}", handler.FetchTasks)
	})

	return r
}
