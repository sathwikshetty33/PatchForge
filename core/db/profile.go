package db

import "time"


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