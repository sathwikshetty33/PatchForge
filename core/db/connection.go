package db;

import (
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
	"log"
)

type DB struct {
	*gorm.DB
}

func NewConnetion(url string) *DB {
	db,err := gorm.Open(postgres.Open(url), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}
	// err = db.AutoMigrate(&User{}, &Profile{},&Repository{})
	// if err != nil {
	// 	log.Fatal("Failed to run migrations:", err)
	// }
	return &DB{db}
}