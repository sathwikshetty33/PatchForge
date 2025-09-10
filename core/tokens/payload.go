package tokens

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Payload struct {
	UserID    uint
	IssuedAt  time.Time
	ExpiredAt time.Time
	jwt.RegisteredClaims
}

func NewPayload(userID uint, duration int64) (Payload, error) {
	return Payload{
		UserID:    userID,
		IssuedAt:  time.Now(),
		ExpiredAt: time.Now().Add(time.Duration(duration) * time.Second),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(duration) * time.Second)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}, nil
}