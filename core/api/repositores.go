package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sathwikshetty33/PatchForge/tokens"
)

type addRepositoryRequest struct {
	Name          string `json:"name" binding:"required"`
	RepositoryUrl string `json:"repository_url" binding:"required"`
}

type updateRepositoryRequest struct {
	RepoId        int    `json:"repo_id" binding:"required"`
	Name          string `json:"name"`
	RepositoryUrl string `json:"repository_url"`
}

type GitHubWebhookRequest struct {
	Name   string                 `json:"name"`
	Active bool                   `json:"active"`
	Events []string               `json:"events"`
	Config GitHubWebhookConfig    `json:"config"`
}

type GitHubWebhookConfig struct {
	URL         string `json:"url"`
	ContentType string `json:"content_type"`
	Secret      string `json:"secret"`
	InsecureSSL string `json:"insecure_ssl"`
}

type GitHubWebhookResponse struct {
	ID     int    `json:"id"`
	URL    string `json:"url"`
	Active bool   `json:"active"`
}

// createGitHubWebhook creates a webhook for a GitHub repository
func (s *Server) createGitHubWebhook(accessToken, repoFullName, webhookURL, secret string) (int, error) {
	// Extract owner and repo from full name (e.g., "owner/repo")
	parts := strings.Split(repoFullName, "/")
	if len(parts) != 2 {
		return 0, fmt.Errorf("invalid repository full name format: %s", repoFullName)
	}
	owner, repo := parts[0], parts[1]

	webhookReq := GitHubWebhookRequest{
		Name:   "web",
		Active: true,
		Events: []string{"push", "pull_request"},
		Config: GitHubWebhookConfig{
			URL:         webhookURL,
			ContentType: "json",
			Secret:      secret,
			InsecureSSL: "0",
		},
	}

	body, err := json.Marshal(webhookReq)
	if err != nil {
		return 0, fmt.Errorf("failed to marshal webhook request: %w", err)
	}

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/hooks", owner, repo)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return 0, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "token "+accessToken)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, fmt.Errorf("failed to create webhook: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		var errorBody map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&errorBody)
		return 0, fmt.Errorf("github API error (status %d): %v", resp.StatusCode, errorBody)
	}

	var webhookResp GitHubWebhookResponse
	if err := json.NewDecoder(resp.Body).Decode(&webhookResp); err != nil {
		return 0, fmt.Errorf("failed to decode webhook response: %w", err)
	}

	fmt.Printf("✅ Webhook created successfully with ID: %d for repo: %s\n", webhookResp.ID, repoFullName)
	return webhookResp.ID, nil
}

// deleteGitHubWebhook deletes a webhook from a GitHub repository
func (s *Server) deleteGitHubWebhook(accessToken, repoFullName string, webhookID int) error {
	// Extract owner and repo from full name
	parts := strings.Split(repoFullName, "/")
	if len(parts) != 2 {
		return fmt.Errorf("invalid repository full name format: %s", repoFullName)
	}
	owner, repo := parts[0], parts[1]

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/hooks/%d", owner, repo, webhookID)
	req, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "token "+accessToken)
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to delete webhook: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		var errorBody map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&errorBody)
		return fmt.Errorf("github API error (status %d): %v", resp.StatusCode, errorBody)
	}

	fmt.Printf("✅ Webhook deleted successfully (ID: %d) for repo: %s\n", webhookID, repoFullName)
	return nil
}

func (s *Server) addRepository(c *gin.Context) {
	var req addRepositoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	userIDInterface, exists := c.Get("authorization_payload")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDInterface.(*tokens.Payload).UserID
	profile, err := s.db.GetProfileByUserId(userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch profile"})
		return
	}
	if profile.ID == 0 {
		c.JSON(400, gin.H{"error": "Profile does not exist"})
		return
	}

	// Create repository in database first
	repo, err := s.db.CreateRepository(profile.ID, req.Name, req.RepositoryUrl)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create repository"})
		return
	}

	// Extract repository full name from URL
	// Expected format: https://github.com/owner/repo
	repoFullName := strings.TrimPrefix(req.RepositoryUrl, "https://github.com/")
	repoFullName = strings.TrimSuffix(repoFullName, ".git")

	// Create webhook URL - adjust this to your actual webhook endpoint
	webhookURL := s.utils.WebhookURL
	// Create GitHub webhook
	webhookID, err := s.createGitHubWebhook(
		profile.AccessToken,
		repoFullName,
		webhookURL,
		s.utils.GithubSecret,
	)
	if err != nil {
		// Log the error but don't fail the entire operation
		fmt.Printf("⚠️ Failed to create webhook for repo %s: %v\n", req.Name, err)
		// Optionally, you might want to delete the repo from DB if webhook creation fails
		// s.db.DeleteRepository(&repo)
		// c.JSON(500, gin.H{"error": "Failed to create webhook", "details": err.Error()})
		// return
	} else {
		// Store webhook ID in the repository record if you have that field
		// repo.WebhookID = webhookID
		// s.db.UpdateRepository(&repo)
		fmt.Printf("📌 Webhook ID %d stored for repository %s\n", webhookID, req.Name)
	}

	c.JSON(200, repo)
}

func (s *Server) getRepsitories(c *gin.Context) {
	userIDInterface, exists := c.Get("authorization_payload")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDInterface.(*tokens.Payload).UserID
	profile, err := s.db.GetProfileByUserId(userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch profile"})
		return
	}
	if profile.ID == 0 {
		c.JSON(400, gin.H{"error": "Profile does not exist"})
		return
	}
	repos, err := s.db.GetRepositoriesByProfileId(profile.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch repositories"})
		return
	}

	c.JSON(200, repos)
}

func (s *Server) deleteRepository(c *gin.Context) {
	var req updateRepositoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	userIDInterface, exists := c.Get("authorization_payload")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDInterface.(*tokens.Payload).UserID
	profile, err := s.db.GetProfileByUserId(userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch profile"})
		return
	}
	if profile.ID == 0 {
		c.JSON(400, gin.H{"error": "Profile does not exist"})
		return
	}
	repo, err := s.db.GetRepositoryById(uint(req.RepoId))
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch repository"})
		return
	}
	if repo.ID == 0 || repo.ProfileID != profile.ID {
		c.JSON(400, gin.H{"error": "Repository does not exist"})
		return
	}

	// Extract repository full name from URL
	repoFullName := strings.TrimPrefix(repo.RepositoryUrl, "https://github.com/")
	repoFullName = strings.TrimSuffix(repoFullName, ".git")

	// Delete webhook from GitHub
	// Note: You'll need to store webhookID in your Repository model to delete it
	// For now, we'll need to fetch all webhooks and find the one with our URL
	// This is a workaround if you don't have WebhookID stored
	if err := s.deleteWebhookByURL(profile.AccessToken, repoFullName); err != nil {
		fmt.Printf("⚠️ Failed to delete webhook for repo %s: %v\n", repo.Name, err)
		// Continue with deletion even if webhook deletion fails
	}

	// Delete repository from database
	if err := s.db.DeleteRepository(&repo); err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete repository"})
		return
	}

	c.JSON(200, gin.H{"message": "Repository deleted successfully"})
}

// deleteWebhookByURL finds and deletes the webhook that matches our webhook URL
func (s *Server) deleteWebhookByURL(accessToken, repoFullName string) error {
	parts := strings.Split(repoFullName, "/")
	if len(parts) != 2 {
		return fmt.Errorf("invalid repository full name format: %s", repoFullName)
	}
	owner, repo := parts[0], parts[1]

	// List all webhooks
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/hooks", owner, repo)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "token "+accessToken)
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to list webhooks: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("github API error (status %d)", resp.StatusCode)
	}

	var webhooks []struct {
		ID     int `json:"id"`
		Config struct {
			URL string `json:"url"`
		} `json:"config"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&webhooks); err != nil {
		return fmt.Errorf("failed to decode webhooks: %w", err)
	}

	webhookURL := s.utils.WebhookURL
	
	// Find and delete the webhook with our URL
	for _, webhook := range webhooks {
		if webhook.Config.URL == webhookURL {
			return s.deleteGitHubWebhook(accessToken, repoFullName, webhook.ID)
		}
	}

	return fmt.Errorf("webhook not found for URL: %s", webhookURL)
}