package api

import (
	// "log"
	"net/http"
	
	"github.com/gin-gonic/gin"
	"github.com/sathwikshetty33/PatchForge/tokens"
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

	hashedPassword, err := s.utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	_, err = s.db.CreateUser(req.Username, req.Email,hashedPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}
type userLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (s *Server) userLogin(c *gin.Context) {
	var req userLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := s.db.GetUserByUsername(req.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	if !s.utils.CheckPassword(user.Password, req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	token, err := s.jwt.GenerateToken(user.ID, 500000000)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}
type userUpdateRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
func (s *Server) updateUser(c *gin.Context) {
	var req userUpdateRequest
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

	user, err := s.db.GetUserById(userID)
	if err != nil {
		if err.Error() == "record not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if req.Password != "" {
	hashedPassword, err := s.utils.HashPassword(req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
		}
	user.Password = hashedPassword
	}
	if req.Username != "" {
		exists, err := s.db.CheckExistingUser(req.Username, "")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
		if exists && req.Username != user.Username {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
			return
		}
		user.Username = req.Username
	}
	if req.Email != "" {
		exists, err := s.db.CheckExistingUser("", req.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
		if exists && req.Email != user.Email {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
			return
		}
		user.Email = req.Email
	}

	if err := s.db.UpdateUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

