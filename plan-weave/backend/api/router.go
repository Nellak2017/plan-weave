package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

const userID = "/{userID}"

func NewRouter(handler *TaskHandler, healthHandler *HealthHandler) http.Handler {
	r := chi.NewRouter()

	// Public Web Server health check endpoints
	r.Route("/health", func(r chi.Router) {
		r.Get("/web_server", healthHandler.WebServer)
		r.Get("/database", healthHandler.Database)
	})

	// Tasks endpoints
	r.Route("/tasks/", func(r chi.Router) {
		r.Get(userID, handler.FetchTasks)
		r.Post("/", handler.AddTask)
		r.Put(userID, handler.UpdateTask)
		r.Patch(userID, handler.UpdateTaskField)
		r.Delete(userID, handler.DeleteTasks)
		r.Post(userID+"/refresh", handler.RefreshTask)
		r.Post(userID+"/refresh_all", handler.RefreshAllTasks)
	})
	return r
}
