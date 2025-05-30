// API endpoint example
package api

import (
	"encoding/json"
	"net/http"

	"github.com/Nellak2017/plan-weave/app"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type TaskHandler struct {
	Service *app.TaskService
}

func (h *TaskHandler) FetchTasks(w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "userID")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "invalid userID", http.StatusBadRequest)
		return
	}

	tasks, err := h.Service.FetchTasks(r.Context(), userID)
	if err != nil {
		http.Error(w, "could not fetch tasks", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}
