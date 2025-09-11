
package api

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sathwikshetty33/PatchForge/tokens"
	"github.com/sathwikshetty33/PatchForge/db"
	"github.com/sathwikshetty33/PatchForge/utils"
)

type Server struct {
	jwt *tokens.JwtCred
	Router *gin.Engine
	db *db.DB
	utils *utils.Utils
}

func NewServer() *Server {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	utils := utils.NewUtils(os.Getenv("HASH_KEY"),os.Getenv("GITHUB_SECRET"))
	secretKey := os.Getenv("SECRET_KEY")
	jwt := tokens.NewJWT(secretKey)
	db := db.NewConnetion(os.Getenv("DATABASE_URL"))
	server :=Server{jwt: jwt,
	db:db,
	utils: utils,
}
	router:= gin.Default()
	router.POST("/register", server.userRegistration)
	router.POST("/login", server.userLogin)
	router.POST("/webhook", server.webhook)
	authRoutes := router.Group("/").Use(authMiddleware(*server.jwt))
	authRoutes.PUT("/profile", server.updateProfile)
	authRoutes.GET("/profile", server.getUserProfile)
	authRoutes.PUT("/user", server.updateUser)
	authRoutes.POST("/repositories", server.addRepository)
	authRoutes.GET("/repositories", server.getRepsitories)
	authRoutes.PUT("/repositories", server.updateRepository)
	server.Router = router
	
	return &server
}


func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}