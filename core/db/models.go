package db

import (
	"time"
)

type User struct {
	ID        uint      `gorm:"primaryKey"`
	Username  string    
	Email     string    `gorm:"unique;not null"`
	Password  string    
	CreatedAt time.Time
	UpdatedAt time.Time
}
type Profile struct{
	ID 	  uint      `gorm:"primaryKey"`
	UserID      uint      `gorm:"uniqueIndex;not null"` // Unique + FK → Enforces strict 1:1
	User        User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"` // Relation
	GithubUrl string `gorm:"not null"`
	AccessToken string `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Repository struct {
	ID        uint      `gorm:"primaryKey"`
	ProfileID    uint      `gorm:"index;not null"` // Foreign key
	Profile      Profile   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"` // Relation
	Name      string    `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
	RepositoryUrl string `gorm:"not null"`
}

type ReleaseNotes struct {
	ID          uint      `gorm:"primaryKey"`
	RepositoryID uint      `gorm:"index;not null"` // Foreign key
	Repository   Repository `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"` // Relation
	Version     string    `gorm:"not null"`
	Notes       string    `gorm:"type:text;not null"`
	CreatedAt   time.Time
}