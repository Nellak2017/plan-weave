package api

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/Nellak2017/plan-weave/app"
	db "github.com/Nellak2017/plan-weave/infra/db/generated"
	"github.com/google/uuid"
)

const invalidUserId = "invalid userID in token"
const contentType = "Content-Type"
const appJSON = "application/json"

type TaskHandler struct {
	Service *app.TaskService
}

func (h *TaskHandler) FetchTasks(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(GetUserID(r))
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}

	tasks, err := h.Service.FetchTasks(r.Context(), userID)
	if err != nil {
		log.Printf("❌ FetchTasksWithDependencies DB error: %v", err)
		http.Error(w, "could not fetch tasks with dependencies", http.StatusInternalServerError)
		return
	}

	w.Header().Set(contentType, appJSON)
	json.NewEncoder(w).Encode(tasks)
	log.Printf("✅ FetchTasksWithDependencies succeeded for user %s", userID)
}

func (h *TaskHandler) AddTask(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(GetUserID(r))
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}

	var task db.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "invalid task data", http.StatusBadRequest)
		return
	}
	task.UserID = userID // Always override userID from middleware

	if task.UserID != uuid.Nil && task.UserID != userID {
		http.Error(w, "userID must not be provided or must match your own", http.StatusBadRequest)
		return
	}
	taskID, err := h.Service.AddTask(r.Context(), task)
	if err != nil {
		log.Printf("❌ AddTasks DB error: %v", err)
		http.Error(w, "could not add task", http.StatusInternalServerError)
		return
	}
	log.Printf("✅ AddTask succeeded: taskID = %d", taskID)
	w.Header().Set(contentType, appJSON)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"created_task_id": taskID,
	})
}

func (h *TaskHandler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(GetUserID(r))
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}
	var task db.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "invalid task data", http.StatusBadRequest)
		return
	}
	task.UserID = userID // Always override userID

	if task.UserID != uuid.Nil && task.UserID != userID {
		http.Error(w, "userID must not be provided or must match your own", http.StatusBadRequest)
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
	w.Header().Set(contentType, appJSON)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{
		"updated_task_id": taskID,
	})
}

func (h *TaskHandler) UpdateTaskField(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(GetUserID(r))
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}

	var payload struct {
		TaskID int64  `json:"task_id"`
		Field  string `json:"field"`
		Value  string `json:"value"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	taskID, err := h.Service.UpdateTaskField(r.Context(), userID, payload.TaskID, payload.Field, payload.Value)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "task not found or not updated", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("❌ UpdateTaskField error: %v", err)
		http.Error(w, "could not update task field", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Updated task %d field %s", taskID, payload.Field)
	w.Header().Set(contentType, appJSON)
	json.NewEncoder(w).Encode(map[string]any{
		"updated_task_id": taskID,
		"field":           payload.Field,
	})
}

func (h *TaskHandler) DeleteTasks(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(GetUserID(r))
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

func (h *TaskHandler) AddTaskDependencies(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(GetUserID(r))
	if err != nil {
		http.Error(w, "invalid user", http.StatusBadRequest)
		return
	}

	var payload struct {
		TaskID       int64   `json:"task_id"`
		Dependencies []int64 `json:"dependencies"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	inserted, err := h.Service.AddTaskDependencies(r.Context(), payload.TaskID, userID, payload.Dependencies)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to add dependencies: %v", err), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"added_dependencies": inserted,
	})
}

// TODO: update field "DependencyIDs" to "Dependencies" to be more consistent in the API
func (h *TaskHandler) DeleteTaskDependencies(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(GetUserID(r))
	if err != nil {
		http.Error(w, "invalid user ID", http.StatusBadRequest)
		return
	}

	var req struct {
		TaskID        int64   `json:"task_id"`
		DependencyIDs []int64 `json:"dependency_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// 🔒 Ownership check
	isOwner, err := h.Service.IsTaskOwnedByUser(r.Context(), req.TaskID, userID)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	if !isOwner {
		http.Error(w, "unauthorized: task does not belong to you", http.StatusForbidden)
		return
	}

	// 🔨 Proceed with deletion
	removed, err := h.Service.DeleteTaskDependencies(r.Context(), req.TaskID, req.DependencyIDs)
	if err != nil {
		log.Printf("❌ DeleteTaskDependencies error: %v", err)
		http.Error(w, "could not remove dependencies", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Deleted dependencies from task %d: %v", req.TaskID, removed)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"removed_dependencies": removed,
	})
}

func (h *TaskHandler) ClearTaskDependencies(w http.ResponseWriter, r *http.Request) {
	_, err := uuid.Parse(GetUserID(r))
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}

	var req struct {
		TaskID int64 `json:"task_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid task dependency clear request", http.StatusBadRequest)
		return
	}
	taskID, err := h.Service.ClearTaskDependencies(r.Context(), req.TaskID)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "task dependencies not found", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("❌ ClearTaskDependencies DB error: %v", err)
		http.Error(w, "could not clear task dependencies", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ ClearTaskDependencies succeeded: taskID = %d", taskID)
	w.Header().Set(contentType, appJSON)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{
		"cleared_task_id": taskID,
	})
}

func (h *TaskHandler) RefreshTask(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(GetUserID(r))
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}

	var payload struct {
		TaskID int64 `json:"task_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	taskID, err := h.Service.RefreshTask(r.Context(), userID, payload.TaskID)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "task not found or not owned by user", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("❌ RefreshTask DB error: %v", err)
		http.Error(w, "could not refresh task", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Refreshed task %d", taskID)
	w.Header().Set(contentType, appJSON)
	json.NewEncoder(w).Encode(map[string]any{
		"refreshed_task_id": taskID,
	})
}

func (h *TaskHandler) RefreshAllTasks(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(GetUserID(r))
	if err != nil {
		http.Error(w, invalidUserId, http.StatusBadRequest)
		return
	}

	taskIDs, err := h.Service.RefreshAllTasks(r.Context(), userID)
	if err != nil {
		log.Printf("❌ RefreshAllTasks DB error: %v", err)
		http.Error(w, "could not refresh tasks", http.StatusInternalServerError)
		return
	}
	if len(taskIDs) == 0 {
		http.Error(w, "no tasks refreshed (not found or unauthorized)", http.StatusNotFound)
		return
	}

	log.Printf("✅ Refreshed %d tasks", len(taskIDs))
	w.Header().Set(contentType, appJSON)
	json.NewEncoder(w).Encode(map[string]any{
		"refreshed_task_ids": taskIDs,
	})
}
