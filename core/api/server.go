
package api

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sathwikshetty33/PatchForge/tokens"
	"github.com/sathwikshetty33/PatchForge/db"
	"gorm.io/gorm"
)

type Server struct {
	jwt *tokens.JwtCred
	Router *gin.Engine
	db *gorm.DB
}

func NewServer() *Server {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	router:= gin.Default()
	secretKey := os.Getenv("SECRET_KEY")
	jwt := tokens.NewJWT(secretKey)
	db := db.NewConnetion(os.Getenv("DATABASE_URL"))
	return &Server{jwt: jwt,
	db:db,
	Router: router,
}
}