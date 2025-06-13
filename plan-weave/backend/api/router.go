package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

const base = "/"

func NewRouter(handler *TaskHandler, healthHandler *HealthHandler) http.Handler {
	r := chi.NewRouter()

	// Public Web Server health check endpoints
	r.Route("/health", func(r chi.Router) {
		r.Get("/web_server", healthHandler.WebServer)
		r.Get("/database", healthHandler.Database)
	})

	// Tasks endpoints
	r.Route("/tasks/", func(r chi.Router) {
		r.Use(AuthMiddleware)
		r.Get(base, handler.FetchTasks)
		r.Post(base, handler.AddTask)
		r.Put(base, handler.UpdateTask)
		r.Patch(base, handler.UpdateTaskField)
		r.Delete(base, handler.DeleteTasks)
		r.Post(base+"refresh/", handler.RefreshTask)
		r.Post(base+"refresh_all/", handler.RefreshAllTasks)
	})
	return r
}
