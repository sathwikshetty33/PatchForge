package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sathwikshetty33/PatchForge/tokens"
)


func (s *Server) getReleaseNotesByUserId(c *gin.Context) {
	// Get the user from the context
	userIDInterface, exists := c.Get("authorization_payload")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDInterface.(*tokens.Payload).UserID
	release_notes , err := s.db.GetReleaseNotesByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"release_notes": release_notes})
}

func (s *Server) getReleaseNotesByRepoID(c *gin.Context) {
	// Extract repoID from URL parameters
	repoIDParam := c.Param("repoID")

	// Convert the repoID string to uint
	repoID64, err := strconv.ParseUint(repoIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid repository ID"})
		return
	}
	repoID := uint(repoID64)

	// Fetch release notes from the database
	releaseNotes, err := s.db.GetReleaseNotesByRepoID(repoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch release notes"})
		return
	}

	// Handle case when no release notes are found
	if len(releaseNotes) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No release notes found for this repository"})
		return
	}

	// Return the release notes as JSON
	c.JSON(http.StatusOK, gin.H{
		"repository_id": repoID,
		"release_notes": releaseNotes,
	})
}
