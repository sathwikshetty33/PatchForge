package utils

import "golang.org/x/crypto/bcrypt"



type Utils struct{
	HashKey string
	GithubSecret string
	WebhookURL string
}
func NewUtils(hashKey string,GithubSecret string,WebhookURL string) *Utils{

	return &Utils{HashKey: hashKey, GithubSecret: GithubSecret,WebhookURL: WebhookURL}
}
// HashPassword hashes a plain-text password using bcrypt.
func(u *Utils) HashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

func(u *Utils) CheckPassword(hashedPassword, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}