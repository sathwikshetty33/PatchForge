package tokens

import (
	"github.com/golang-jwt/jwt/v5"
)

type jwtCred struct {
	secretKey string
}

func NewJWT(secret string) *jwtCred {
	return &jwtCred{secretKey: secret}
}

func (j *jwtCred) GenerateToken(userID uint, duration int64) (string, error) {
	payload, err := NewPayload(userID, duration)
	if err != nil {
		return "", err
	}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &payload)
	return jwtToken.SignedString([]byte(j.secretKey))
}