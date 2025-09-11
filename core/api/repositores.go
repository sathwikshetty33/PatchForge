package api

import (
	"github.com/gin-gonic/gin"
	"github.com/sathwikshetty33/PatchForge/tokens"
)

type addRepositoryRequest struct {
	Name string `json:"name" binding:"required"`
	RepositoryUrl string `json:"repository_url" binding:"required"`
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
	profile,err := s.db.GetProfileByUserId(userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch profile"})
		return
	}
	if profile.ID == 0 {
		c.JSON(400, gin.H{"error": "Profile does not exist"})
		return
	}
	repo, err := s.db.CreateRepository(profile.ID, req.Name, req.RepositoryUrl)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create repository"})
		return
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
	profile,err := s.db.GetProfileByUserId(userID)
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

type updateRepositoryRequest struct {
	RepoId int `json:"repo_id" binding:"required"`
	Name string `json:"name"`
	RepositoryUrl string `json:"repository_url"`
}

func (s *Server) updateRepository(c *gin.Context) {
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
	profile,err := s.db.GetProfileByUserId(userID)
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
	if req.Name != "" {
		repo.Name = req.Name
	}
	if req.RepositoryUrl != "" {
		repo.RepositoryUrl = req.RepositoryUrl
	}
	if err := s.db.UpdateRepository(&repo); err != nil {
		c.JSON(500, gin.H{"error": "Failed to update repository"})
		return
	}

	c.JSON(200, repo)
}