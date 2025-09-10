package tokens

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

type JwtCred struct {
	secretKey string
}
var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("token has expired")
)
func NewJWT(secret string) *JwtCred {
	return &JwtCred{secretKey: secret}
}

func (j *JwtCred) GenerateToken(userID uint, duration int64) (string, error) {
	payload, err := NewPayload(userID, duration)
	if err != nil {
		return "", err
	}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &payload)
	return jwtToken.SignedString([]byte(j.secretKey))
}


func (j *JwtCred) VerifyToken(token string) (*Payload, error) {
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrInvalidToken
		}
		return []byte(j.secretKey), nil
	}

	jwtToken, err := jwt.ParseWithClaims(token, &Payload{}, keyFunc, jwt.WithLeeway(0))
	if err != nil {
		// jwt/v5 gives structured error checking functions:
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	payload, ok := jwtToken.Claims.(*Payload)
	if !ok || !jwtToken.Valid {
		return nil, ErrInvalidToken
	}

	return payload, nil
}
