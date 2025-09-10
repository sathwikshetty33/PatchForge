package api

import (
	// "log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type userRegistrationRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func (s *Server) userRegistration(c *gin.Context) {
	var req userRegistrationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	check, err := s.db.CheckExistingUser(req.Username, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	if check {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username or email already exists"})
		return
	}


	_, err = s.db.CreateUser(req.Username, req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}
