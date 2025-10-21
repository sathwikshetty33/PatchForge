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
	if password != "" {
	user.Password = password
	}
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	db.Create(&user)
	createdUser, err := db.GetUserByUsername(username)
	if err != nil {
		return User{}, err
	}
	Profile := Profile{
		UserID: createdUser.ID,
		User: user,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		GithubUrl: "",
		AccessToken: "",
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

func (db *DB) GetUserById(id uint) (User, error) {
	var user User
	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return User{}, err
	}
	return user, nil
}
func (db *DB) GetUserByEmail(email string) (User, error) {
	var user User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		return User{}, err
	}
	return user, nil
}

func (db *DB) UpdateUser(user *User) error {
	if err := db.Save(user).Error; err != nil {
		return err
	}
	return nil
}