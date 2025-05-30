package api

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/Nellak2017/plan-weave/app"
	db "github.com/Nellak2017/plan-weave/infra/db/generated"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

const invalidUserId = "invalid userID"

type TaskHandler struct {
	Service *app.TaskService
}

func (h *TaskHandler) FetchTasks(w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "userID")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}

	tasks, err := h.Service.FetchTasks(r.Context(), userID)
	if err != nil {
		log.Printf("❌ FetchTasks DB error: %v", err)
		http.Error(w, "could not fetch tasks", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
	log.Printf("✅ FetchTasks succeeded")
}

func (h *TaskHandler) AddTask(w http.ResponseWriter, r *http.Request) {
	var task db.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "invalid task data", http.StatusBadRequest)
		return
	}
	taskID, err := h.Service.AddTask(r.Context(), task)
	if err != nil {
		log.Printf("❌ AddTasks DB error: %v", err)
		http.Error(w, "could not add task", http.StatusInternalServerError)
		return
	}
	log.Printf("✅ AddTask succeeded: taskID = %d", taskID)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"created_task_id": taskID,
	})
}

func (h *TaskHandler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(chi.URLParam(r, "userID"))
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}
	var task db.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "invalid task data", http.StatusBadRequest)
		return
	}
	if task.UserID != userID {
		http.Error(w, "userID mismatch", http.StatusBadRequest)
		return
	}
	taskID, err := h.Service.UpdateTask(r.Context(), userID, task)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "task not found", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("❌ UpdateTasks DB error: %v", err)
		http.Error(w, "could not update task", http.StatusInternalServerError)
		return
	}
	log.Printf("✅ UpdateTask succeeded: taskID = %d", taskID)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"updated_task_id": taskID,
	})
}

func (h *TaskHandler) DeleteTasks(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(chi.URLParam(r, "userID"))
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}
	var taskIDs []int64
	if err := json.NewDecoder(r.Body).Decode(&taskIDs); err != nil {
		http.Error(w, "invalid task ID list", http.StatusBadRequest)
		return
	}
	deletedIDs, err := h.Service.DeleteTasks(r.Context(), userID, taskIDs)
	if err != nil {
		log.Printf("❌ DeleteTasks DB error: %v", err)
		http.Error(w, "could not delete tasks", http.StatusInternalServerError)
		return
	}

	if len(deletedIDs) == 0 {
		http.Error(w, "no tasks deleted (not found or unauthorized)", http.StatusNotFound)
		return
	}

	log.Printf("✅ Deleted %d tasks", len(deletedIDs))
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string][]int64{
		"deleted_ids": deletedIDs,
	})
}
