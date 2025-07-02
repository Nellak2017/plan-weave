package api

import "net/http"

// CORSMiddleware sets CORS headers for incoming requests
func CORSMiddleware(next http.Handler) http.Handler {
	allowedOrigins := map[string]bool{
		"http://localhost:3000": true,
		"https://planweave.com": true,
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from your frontend origin(s)
		origin := r.Header.Get("Origin")
		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

		// Handle preflight OPTIONS request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
