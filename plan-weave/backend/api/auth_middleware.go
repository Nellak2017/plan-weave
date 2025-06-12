package api

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userIDKey contextKey = "userID"

// AuthMiddleware validates the Supabase JWT token and injects userID into context
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, "Bearer ")
		if len(parts) != 2 {
			http.Error(w, "Malformed Authorization header", http.StatusUnauthorized)
			return
		}

		tokenStr := parts[1]
		secret := []byte(os.Getenv("SUPABASE_JWT_SECRET"))

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (any, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		sub, ok := claims["sub"].(string)
		if !ok {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userIDKey, sub)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Helper to get userID from context in handlers
func GetUserID(r *http.Request) string {
	val := r.Context().Value(userIDKey)
	if val == nil {
		return ""
	}
	return val.(string)
}
