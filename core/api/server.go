// ============================================
// Updated Server Setup with CORS
// ============================================
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
	jwt    *tokens.JwtCred
	Router *gin.Engine
	db     *db.DB
	utils  *utils.Utils
}

// CORS Middleware
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func NewServer() *Server {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	utils := utils.NewUtils(os.Getenv("HASH_KEY"), os.Getenv("GITHUB_SECRET"),os.Getenv("WEBHOOK_URL"))
	secretKey := os.Getenv("SECRET_KEY")
	
	jwt := tokens.NewJWT(secretKey)
	db := db.NewConnetion(os.Getenv("DATABASE_URL"))
	server := Server{
		jwt:   jwt,
		db:    db,
		utils: utils,
	}
	router := gin.Default()
	
	// ADD CORS MIDDLEWARE FIRST - BEFORE ANY ROUTES
	router.Use(CORSMiddleware())
	
	// Public routes
	router.POST("/register", server.userRegistration)
	router.POST("/api/login", server.userLogin)
	router.POST("/webhook", server.webhook)
	router.POST("/api/auth/github", server.githubAuth)
	// Protected routes
	authRoutes := router.Group("/").Use(authMiddleware(*server.jwt))
	authRoutes.PUT("/profile", server.updateProfile)
	authRoutes.GET("/profile", server.getUserProfile)
	authRoutes.PUT("/user", server.updateUser)
	authRoutes.POST("/repositories", server.addRepository)
	authRoutes.GET("/repositories", server.getRepsitories)
	authRoutes.PUT("/repositories", server.deleteRepository)
	authRoutes.GET("/release-notes", server.getReleaseNotesByUserId)
	authRoutes.GET("/release-notes/:repoID", server.getReleaseNotesByRepoID)
	server.Router = router

	return &server
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}

// ============================================
// Apply in your main.go or router setup
// ============================================

// Example usage in main.go:
/*
package main

import (
	"github.com/gin-gonic/gin"
	"yourapp/middleware"
)

func main() {
	r := gin.Default()
	
	// Add CORS middleware BEFORE your routes
	r.Use(middleware.CORSMiddleware())
	
	// Your routes
	r.POST("/auth/login", loginHandler)
	r.POST("/auth/signup", signupHandler)
	r.POST("/auth/google", googleAuthHandler)
	
	r.Run(":8080")
}
*/