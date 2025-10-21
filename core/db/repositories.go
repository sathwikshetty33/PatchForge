package db

import "time"

func (db *DB) CreateRepository(profileID uint, name string, repositoryUrl string) (Repository, error) {
	var repo Repository
	repo.Name = name
	repo.RepositoryUrl = repositoryUrl
	repo.ProfileID = profileID

	if err := db.Create(&repo).Error; err != nil {
		return Repository{}, err
	}
	return repo, nil
}

func (db *DB) GetRepositoriesByProfileId(profileID uint) ([]Repository, error) {
	var repos []Repository
	if err := db.Where("profile_id = ?", profileID).Find(&repos).Error; err != nil {
		return nil, err
	}
	return repos, nil
}

func (db *DB) GetRepositoryById(id uint) (Repository, error) {
	var repo Repository
	if err := db.Where("id = ?", id).First(&repo).Error; err != nil {
		return Repository{}, err
	}
	return repo, nil
}
func (db *DB) DeleteRepository(repo *Repository) error {
	repo.UpdatedAt = time.Now()
	if err := db.Delete(repo).Error; err != nil {
		return err
	}
	return nil
}