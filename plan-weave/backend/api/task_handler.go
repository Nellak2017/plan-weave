// API endpoint example
package api

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/Nellak2017/plan-weave/app"
)

type UserHandler struct {
	Service *app.TaskService
}

func (h *UserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.ParseInt(idStr, 10, 64)
	task, err := h.Service.GetUser(id)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	fmt.Fprintf(w, "User: %s <%d>", task.Task, task.TTC)
}
