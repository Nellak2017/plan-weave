package api

import (
	"log"
	"net/http"

	"github.com/Nellak2017/plan-weave/app"
)

type HealthHandler struct {
	Service *app.HealthService
}

func (h *HealthHandler) WebServer(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func (h *HealthHandler) Database(w http.ResponseWriter, r *http.Request) {
	err := h.Service.CheckDatabase(r.Context())
	if err != nil {
		log.Printf("❌ DB health check failed: %v", err)
		http.Error(w, "database unreachable", http.StatusServiceUnavailable)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
