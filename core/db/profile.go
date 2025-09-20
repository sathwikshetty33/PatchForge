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

func (db *DB) GetProfileByGithubUrl(request string) (string,string, error) {
	var prof Profile

	// Extract username before the first "/"
	parts := strings.SplitN(request, "/", 2)
	if len(parts) == 0 {
		return "","", fmt.Errorf("invalid request format: %s", request)
	}
	githubUsername := parts[0]

	// Query the DB
	if err := db.Where("github_url LIKE ?", "%"+githubUsername+"%").First(&prof).Error; err != nil {
		return "","", err
	}
	user,err := db.GetUserById(prof.UserID)
	if (err != nil) {
		return "","", err
	}
	return prof.AccessToken,user.Email, nil
}
