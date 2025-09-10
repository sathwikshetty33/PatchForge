
package api

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sathwikshetty33/PatchForge/tokens"
	"github.com/sathwikshetty33/PatchForge/db"
)

type Server struct {
	jwt *tokens.JwtCred
	Router *gin.Engine
	db *db.DB
}

func NewServer() *Server {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	secretKey := os.Getenv("SECRET_KEY")
	jwt := tokens.NewJWT(secretKey)
	db := db.NewConnetion(os.Getenv("DATABASE_URL"))
	server :=Server{jwt: jwt,
	db:db,
}
	router:= gin.Default()
	router.POST("/register", server.userRegistration)
	server.Router = router
	
	return &server
}