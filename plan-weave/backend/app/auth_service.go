package app

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type AuthService struct {
	ProjectURL string
	AdminKey   string
}

func (s *AuthService) CreateAuthUser(ctx context.Context, email, username string) (string, error) {
	payload := map[string]any{
		"email": email,
		"user_metadata": map[string]string{
			"username":  username,
			"full_name": username,
		},
	}

	reqBody, _ := json.Marshal(payload)
	url := fmt.Sprintf("%s/auth/v1/admin/users", s.ProjectURL)

	req, _ := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(reqBody))
	req.Header.Set("apikey", s.AdminKey)
	req.Header.Set("Authorization", "Bearer "+s.AdminKey)
	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode >= 400 {
		body, _ := io.ReadAll(res.Body)
		return "", fmt.Errorf("failed to create auth user: %s", string(body))
	}

	var result struct {
		User struct {
			ID string `json:"id"`
		} `json:"user"`
	}
	if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
		return "", err
	}

	return result.User.ID, nil
}
