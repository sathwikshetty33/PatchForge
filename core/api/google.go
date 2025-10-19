package api

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
	"gorm.io/gorm"
)

type googleAuthRequest struct {
	IdToken string `json:"id_token" binding:"required"`
}

func (s *Server) googleAuth(c *gin.Context) {
	var req googleAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payload, err := idtoken.Validate(c, req.IdToken, os.Getenv("GOOGLE_CLIENT_ID"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Google token"})
		return
	}

	email := payload.Claims["email"].(string)
	name := payload.Claims["name"].(string)

	// Check if user already exists in DB
	user, err := s.db.GetUserByEmail(email)
	if err != nil {
		// Check for GORM's ErrRecordNotFound instead of sql.ErrNoRows
		if err != gorm.ErrRecordNotFound {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
		// user not found, create one
		user, err = s.db.CreateUser(name, email, "")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
	}

	// Generate app JWT
	token, err := s.jwt.GenerateToken(user.ID, 500000000)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}