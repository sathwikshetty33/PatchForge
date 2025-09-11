package api

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sathwikshetty33/PatchForge/tokens"
)

type profileUpdateRequest struct {
	GithubUrl string `json:"github_url"`
	AccessToken string `json:"access_token"`
}

func (s *Server) updateProfile(c *gin.Context) {
	var req profileUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDInterface, exists := c.Get("authorization_payload")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDInterface.(*tokens.Payload).UserID
	log.Println("userID from token:", userID)
	profile, err := s.db.GetProfileByUserId(userID)
	log.Println("Fetched profile:", profile)
	if err != nil {
		if err.Error() == "record not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if req.GithubUrl != "" {
		profile.GithubUrl = req.GithubUrl
	}
	if req.AccessToken != ""{
		profile.AccessToken = req.AccessToken
	}
	

	if err := s.db.UpdateProfile(&profile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}
type userProfileResponse struct {
	Username  string `json:"username"`
	Email    string `json:"email"`
	GithubUrl string `json:"github_url"`
	AccessToken string `json:"access_token"`
}
	
func (s *Server) getUserProfile(c *gin.Context) {
	userIDInterface, exists := c.Get("authorization_payload")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDInterface.(*tokens.Payload).UserID

	user, err := s.db.GetUserById(userID)
	if err != nil {
		if err.Error() == "record not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	profile, err := s.db.GetProfileByUserId(userID)
	if err != nil {
		if err.Error() == "record not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	response := userProfileResponse{
		Username:  user.Username,
		Email:    user.Email,
		GithubUrl: profile.GithubUrl,
		AccessToken: profile.AccessToken,
	}

	c.JSON(http.StatusOK, response)
}