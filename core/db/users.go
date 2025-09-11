package db

import (
	"time"

	"gorm.io/gorm"
)


func(db *DB) CheckExistingUser( username string, email string) (bool, error) {
	var existingUser User
	if err := db.Where("username = ? OR email = ?", username, email).First(&existingUser).Error; err == nil {
		// Record found → return true
		return true, nil
	} else if err != gorm.ErrRecordNotFound {
		// Some other DB error
		return false, err
	}
	return false, nil
}

func (db *DB) CreateUser(username string, email string, password string,) (User, error) {
	var user User
	user.Username = username
	user.Email = email
	user.Password = password
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	db.Create(&user)
	Profile := Profile{
		UserID: user.ID,
		User: user,
	}
	db.Create(&Profile)
	return user, nil
}
func (db *DB) GetUserByUsername(username string) (User, error) {
	var user User
	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
		return User{}, err
	}
	return user, nil
}