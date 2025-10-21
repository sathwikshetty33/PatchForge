package db

import (
	"fmt"
	"strings"
	"time"
)


func (db *DB) GetProfileByUserId(id uint) (Profile, error) {
	var prof Profile
	if err := db.Where("User_ID = ?", id).First(&prof).Error; err != nil {
		return Profile{}, err
	}
	return prof, nil
}

func (db *DB) UpdateProfile(profile *Profile) error {
	profile.UpdatedAt = time.Now()
	if err := db.Save(profile).Error; err != nil {
		return err
	}
	return nil
}

func (db *DB) GetProfileByGithubUrl(repoFullName string) (string, string, error) {
	var prof Profile

	// Extract username from repo full name (e.g., "sathwikshetty33/PatchForge" -> "sathwikshetty33")
	parts := strings.SplitN(repoFullName, "/", 2)
	if len(parts) == 0 {
		return "", "", fmt.Errorf("invalid repository format: %s", repoFullName)
	}
	githubUsername := parts[0]

	// Query the DB - github_url field actually stores just the username
if err := db.Where("github_url = ?", githubUsername).First(&prof).Error; err != nil {
	return "", "", fmt.Errorf("profile not found for github user %s: %w", githubUsername, err)
}


	// Get user email
	user, err := db.GetUserById(prof.UserID)
	if err != nil {
		return "", "", fmt.Errorf("user not found for profile: %w", err)
	}

	// Return access token and email
	return prof.AccessToken, user.Email, nil
}