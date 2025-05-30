package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

const userID = "/{userID}"

func NewRouter(handler *TaskHandler) http.Handler {
	r := chi.NewRouter()

	r.Route("/tasks/", func(r chi.Router) {
		r.Get(userID, handler.FetchTasks)
		r.Post("/", handler.AddTask)
		r.Put(userID, handler.UpdateTask)
		r.Delete(userID, handler.DeleteTasks)
	})

	return r
}
