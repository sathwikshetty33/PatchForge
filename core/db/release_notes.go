package db

func (db *DB) GetReleaseNotesByUserID(userID uint) ([]ReleaseNotes, error) {
	var releaseNotes []ReleaseNotes
	err := db.Table("release_notes").
		Joins("JOIN repositories ON release_notes.repository_id = repositories.id").
		Joins("JOIN profiles ON repositories.profile_id = profiles.id").
		Where("profiles.user_id = ?", userID).
		Preload("Repository"). // optional: loads associated Repository structs
		Find(&releaseNotes).Error

	if err != nil {
		return nil, err
	}
	return releaseNotes, nil
}


func (db *DB) GetReleaseNotesByRepoID(repoID uint) ([]ReleaseNotes, error) {
	var releaseNotes []ReleaseNotes
	err := db.Where("repository_id = ?", repoID).
		Order("created_at DESC").
		Find(&releaseNotes).Error

	if err != nil {
		return nil, err
	}
	return releaseNotes, nil
}
