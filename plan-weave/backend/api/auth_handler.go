package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Nellak2017/plan-weave/app"
)

type AuthHandler struct {
	Service *app.AuthService
}

type CreateUserRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
}

func (h *AuthHandler) AddUser(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	userID, err := h.Service.CreateAuthUser(r.Context(), req.Email, req.Username)
	if err != nil {
		log.Printf("❌ Failed to create auth user: %v", err)
		http.Error(w, "failed to create auth user", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Created Auth User: %s (%s)", req.Username, userID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"created_user_id": userID,
	})
}
