// package api

// import (
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"net/http"
// 	"os"

// 	"github.com/gin-gonic/gin"
// 	"gorm.io/gorm"
// )

// type githubAuthRequest struct {
// 	Code string `json:"code" binding:"required"`
// }

// type githubAccessTokenResponse struct {
// 	AccessToken string `json:"access_token"`
// 	TokenType   string `json:"token_type"`
// 	Scope       string `json:"scope"`
// }

// type githubUserResponse struct {
// 	Login     string `json:"login"`
// 	ID        int64  `json:"id"`
// 	Email     string `json:"email"`
// 	Name      string `json:"name"`
// 	AvatarURL string `json:"avatar_url"`
// }

// type githubEmailResponse struct {
// 	Email    string `json:"email"`
// 	Primary  bool   `json:"primary"`
// 	Verified bool   `json:"verified"`
// }

// func (s *Server) githubAuth(c *gin.Context) {
// 	var req githubAuthRequest
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Exchange code for access token
// 	accessToken, err := s.exchangeGitHubCode(req.Code)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to exchange GitHub code"})
// 		return
// 	}

// 	// Get user info from GitHub
// 	githubUser, err := s.getGitHubUser(accessToken)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to get GitHub user info"})
// 		return
// 	}

// 	// If email is not public, fetch from emails endpoint
// 	if githubUser.Email == "" {
// 		email, err := s.getGitHubPrimaryEmail(accessToken)
// 		if err != nil {
// 			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to get GitHub user email"})
// 			return
// 		}
// 		githubUser.Email = email
// 	}

// 	// Check if user already exists in DB
// 	user, err := s.db.GetUserByEmail(githubUser.Email)
// 	if err != nil {
// 		if err != gorm.ErrRecordNotFound {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
// 			return
// 		}
// 		// User not found, create one
// 		name := githubUser.Name
// 		if name == "" {
// 			name = githubUser.Login
// 		}
// 		user, err = s.db.CreateUser(name, githubUser.Email, "")
// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
// 			return
// 		}
// 	}

// 	profile, err := s.db.GetProfileByUserId(user.ID)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user profile"})
// 		return
// 	}
// 	profile.GithubUrl = githubUser.Login
// 	profile.AccessToken = accessToken
// 	err = s.db.UpdateProfile(&profile)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store GitHub token"})
// 		return
// 	}

// 	// Generate app JWT
// 	token, err := s.jwt.GenerateToken(user.ID, 500000000)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"token": token})
// }

// func (s *Server) exchangeGitHubCode(code string) (string, error) {
// 	clientID := os.Getenv("GITHUB_CLIENT_ID")
// 	clientSecret := os.Getenv("GITHUB_CLIENT_SECRET")

// 	url := fmt.Sprintf(
// 		"https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=%s",
// 		clientID, clientSecret, code,
// 	)

// 	req, err := http.NewRequest("POST", url, nil)
// 	if err != nil {
// 		return "", err
// 	}
// 	req.Header.Set("Accept", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		return "", err
// 	}
// 	defer resp.Body.Close()

// 	body, err := io.ReadAll(resp.Body)
// 	if err != nil {
// 		return "", err
// 	}

// 	var tokenResp githubAccessTokenResponse
// 	if err := json.Unmarshal(body, &tokenResp); err != nil {
// 		return "", err
// 	}

// 	if tokenResp.AccessToken == "" {
// 		return "", fmt.Errorf("no access token received")
// 	}

// 	return tokenResp.AccessToken, nil
// }

// func (s *Server) getGitHubUser(accessToken string) (*githubUserResponse, error) {
// 	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
// 	if err != nil {
// 		return nil, err
// 	}
// 	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
// 	req.Header.Set("Accept", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer resp.Body.Close()

// 	body, err := io.ReadAll(resp.Body)
// 	if err != nil {
// 		return nil, err
// 	}

// 	var user githubUserResponse
// 	if err := json.Unmarshal(body, &user); err != nil {
// 		return nil, err
// 	}

// 	return &user, nil
// }

// func (s *Server) getGitHubPrimaryEmail(accessToken string) (string, error) {
// 	req, err := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
// 	if err != nil {
// 		return "", err
// 	}
// 	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
// 	req.Header.Set("Accept", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		return "", err
// 	}
// 	defer resp.Body.Close()

// 	body, err := io.ReadAll(resp.Body)
// 	if err != nil {
// 		return "", err
// 	}

// 	var emails []githubEmailResponse
// 	if err := json.Unmarshal(body, &emails); err != nil {
// 		return "", err
// 	}

// 	// Find primary verified email
// 	for _, email := range emails {
// 		if email.Primary && email.Verified {
// 			return email.Email, nil
// 		}
// 	}

// 	// Fallback to first verified email
// 	for _, email := range emails {
// 		if email.Verified {
// 			return email.Email, nil
// 		}
// 	}

// 	return "", fmt.Errorf("no verified email found")
// }

package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type githubAuthRequest struct {
	Code string `json:"code" binding:"required"`
}

type githubAccessTokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	Scope       string `json:"scope"`
	Error       string `json:"error"`
	ErrorDescription string `json:"error_description"`
}

type githubUserResponse struct {
	Login     string `json:"login"`
	ID        int64  `json:"id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	AvatarURL string `json:"avatar_url"`
}

type githubEmailResponse struct {
	Email    string `json:"email"`
	Primary  bool   `json:"primary"`
	Verified bool   `json:"verified"`
}

func (s *Server) githubAuth(c *gin.Context) {
	var req githubAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Exchange code for access token
	accessToken, err := s.exchangeGitHubCode(req.Code)
	if err != nil {
		fmt.Printf("Failed to exchange GitHub code: %v\n", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to exchange GitHub code. The code may have expired or already been used."})
		return
	}

	// Get user info from GitHub
	githubUser, err := s.getGitHubUser(accessToken)
	if err != nil {
		fmt.Printf("Failed to get GitHub user: %v\n", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to get GitHub user info"})
		return
	}

	// If email is not public, fetch from emails endpoint
	if githubUser.Email == "" {
		email, err := s.getGitHubPrimaryEmail(accessToken)
		if err != nil {
			fmt.Printf("Failed to get GitHub email: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to get GitHub user email"})
			return
		}
		githubUser.Email = email
	}

	// Check if user already exists in DB
	user, err := s.db.GetUserByEmail(githubUser.Email)
	if err != nil {
		if err != gorm.ErrRecordNotFound {
			fmt.Printf("Database error: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
		// User not found, create one
		name := githubUser.Name
		if name == "" {
			name = githubUser.Login
		}
		user, err = s.db.CreateUser(name, githubUser.Email, "")
		if err != nil {
			fmt.Printf("Failed to create user: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
		fmt.Printf("Created new user: %s (%s)\n", user.Email, user.Username)
	} else {
		fmt.Printf("User already exists: %s\n", user.Email)
	}
	profile, err := s.db.GetProfileByUserId(user.ID)
	if err != nil {
		fmt.Printf("Failed to get user profile: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user profile"})
		return
	}
	profile.GithubUrl = githubUser.Login
	profile.AccessToken = accessToken
	// Store GitHub access token for the user (for later webhook operations)
	err = s.db.UpdateProfile(&profile)
	if err != nil {
		fmt.Printf("Failed to store GitHub token: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store GitHub token"})
		return
	}

	// Generate app JWT
	token, err := s.jwt.GenerateToken(user.ID, 500000000)
	if err != nil {
		fmt.Printf("Failed to generate token: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	fmt.Printf("GitHub auth successful for user: %s\n", user.Email)
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func (s *Server) exchangeGitHubCode(code string) (string, error) {
	clientID := os.Getenv("GITHUB_CLIENT_ID")
	clientSecret := os.Getenv("GITHUB_CLIENT_SECRET")

	// Create request body
	reqBody := map[string]string{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"code":          code,
	}
	
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://github.com/login/oauth/access_token", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	fmt.Printf("GitHub token exchange response: %s\n", string(body))

	var tokenResp githubAccessTokenResponse
	if err := json.Unmarshal(body, &tokenResp); err != nil {
		return "", fmt.Errorf("failed to parse token response: %v", err)
	}

	if tokenResp.Error != "" {
		return "", fmt.Errorf("GitHub error: %s - %s", tokenResp.Error, tokenResp.ErrorDescription)
	}

	if tokenResp.AccessToken == "" {
		return "", fmt.Errorf("no access token received. Response: %s", string(body))
	}

	return tokenResp.AccessToken, nil
}

func (s *Server) getGitHubUser(accessToken string) (*githubUserResponse, error) {
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("token %s", accessToken))
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	fmt.Printf("GitHub user response: %s\n", string(body))

	var user githubUserResponse
	if err := json.Unmarshal(body, &user); err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Server) getGitHubPrimaryEmail(accessToken string) (string, error) {
	req, err := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", fmt.Sprintf("token %s", accessToken))
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	fmt.Printf("GitHub emails response: %s\n", string(body))

	// Try to unmarshal as array first
	var emails []githubEmailResponse
	if err := json.Unmarshal(body, &emails); err != nil {
		// If it fails, it might be an error response object
		var errorResp map[string]interface{}
		if jsonErr := json.Unmarshal(body, &errorResp); jsonErr == nil {
			return "", fmt.Errorf("GitHub API error: %v", errorResp)
		}
		return "", fmt.Errorf("failed to parse emails response: %v", err)
	}

	// Find primary verified email
	for _, email := range emails {
		if email.Primary && email.Verified {
			return email.Email, nil
		}
	}

	// Fallback to first verified email
	for _, email := range emails {
		if email.Verified {
			return email.Email, nil
		}
	}

	return "", fmt.Errorf("no verified email found")
}