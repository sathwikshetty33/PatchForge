package utils

import "golang.org/x/crypto/bcrypt"



type Utils struct{
	HashKey string
}
func NewUtils(hashKey string) *Utils{
	return &Utils{HashKey: hashKey}
}
// HashPassword hashes a plain-text password using bcrypt.
func(u *Utils) HashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

func CheckPassword(hashedPassword, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}