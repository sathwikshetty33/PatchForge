package api

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
	pb "github.com/sathwikshetty33/PatchForge/grpc_schema"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
)

type PushPayload struct {
	Ref     string `json:"ref"`
	Before  string `json:"before"`
	After   string `json:"after"`
	Commits []struct {
		ID      string `json:"id"`
		Message string `json:"message"`
		Author  struct {
			Name     string `json:"name"`
			Email    string `json:"email"`
			Username string `json:"username"`
		} `json:"author"`
	} `json:"commits"`
	Repository struct {
		Name     string `json:"name"`
		FullName string `json:"full_name"`
	} `json:"repository"`
	Pusher struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	} `json:"pusher"`
	Sender struct {
		Login string `json:"login"`
	} `json:"sender"`
}

type PullRequestPayload struct {
	Action      string `json:"action"`
	Number      int    `json:"number"`
	PullRequest struct {
		Merged bool   `json:"merged"`
		Title  string `json:"title"`
		User   struct {
			Login string `json:"login"`
		} `json:"user"`
		Head struct {
			SHA string `json:"sha"`
			Ref string `json:"ref"`
		} `json:"head"`
		Base struct {
			Ref string `json:"ref"`
		} `json:"base"`
	} `json:"pull_request"`
	Repository struct {
		FullName string `json:"full_name"`
	} `json:"repository"`
}

func verifySignature(secret, signature string, body []byte) bool {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signature))
}

func (s *Server) webhook(c *gin.Context) {
	secret := s.utils.GithubSecret

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "could not read body"})
		return
	}

	sig := c.GetHeader("X-Hub-Signature-256")
	if sig == "" {
		fmt.Println("⚠️ Missing X-Hub-Signature-256 header")
	}

	if !verifySignature(secret, sig, body) {
		fmt.Println("❌ Signature mismatch")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid signature"})
		return
	}

	event := c.GetHeader("X-GitHub-Event")
	fmt.Println("✅ Received GitHub event:", event)

	switch event {
	case "push":
		var payload PushPayload
		if err := json.Unmarshal(body, &payload); err != nil {
			fmt.Println("❌ JSON decode failed:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
			return
		}

		fmt.Printf("📦 Push detected: branch=%s repo=%s pusher=%s\n",
			payload.Ref, payload.Repository.FullName, payload.Pusher.Name)

		// Extract branch name from ref (refs/heads/main -> main)
		branch := strings.TrimPrefix(payload.Ref, "refs/heads/")

		// Process each commit in the push
		if len(payload.Commits) > 0 {
			fmt.Printf("📝 Processing %d commits\n", len(payload.Commits))

			// Get profile info
			token, email, err := s.db.GetProfileByGithubUrl(payload.Repository.FullName)
			if err != nil {
				fmt.Println("⚠️ Failed to get profile from DB:", err)
				// Don't return error, just log it
				c.JSON(http.StatusOK, gin.H{"status": "processed", "note": "profile not found"})
				return
			}

			// Connect to gRPC server
			conn, err := grpc.NewClient("localhost:50051", grpc.WithInsecure())
			if err != nil {
				fmt.Println("❌ Failed to connect to gRPC server:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "grpc connection failed"})
				return
			}
			defer conn.Close()

			client := pb.NewPullRequestServiceClient(conn)
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()

			// Process the latest commit (you can process all if needed)
			latestCommit := payload.Commits[len(payload.Commits)-1]
			author := latestCommit.Author.Username
			if author == "" {
				author = payload.Sender.Login
			}

			req := &pb.Request{
				PrNumber:    0, // 0 for direct commits
				RepoUrl:     payload.Repository.FullName,
				Branch:      branch,
				CommitHash:  latestCommit.ID,
				Author:      author,
				Title:       fmt.Sprintf("Direct push to %s", branch),
				Description: latestCommit.Message,
				AccessToken: token,
				Email:       email,
			}

			_, err = client.ProcessPullRequest(ctx, req)
			if err != nil {
				fmt.Println("❌ gRPC call failed:", err)
			} else {
				fmt.Printf("📨 Push commit sent to gRPC service successfully (commit: %s)\n", latestCommit.ID[:7])
			}
		}

	case "pull_request":
		var payload PullRequestPayload
		if err := json.Unmarshal(body, &payload); err != nil {
			fmt.Println("❌ JSON decode failed:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
			return
		}

		if payload.Action == "closed" && payload.PullRequest.Merged {
			fmt.Printf("✅ Merged PR detected: #%d (%s) by %s in repo %s\n",
				payload.Number,
				payload.PullRequest.Title,
				payload.PullRequest.User.Login,
				payload.Repository.FullName,
			)

			fmt.Printf("🔗 Merge commit: %s (from %s into %s)\n",
				payload.PullRequest.Head.SHA,
				payload.PullRequest.Head.Ref,
				payload.PullRequest.Base.Ref,
			)

			// --- gRPC client call to Python service ---
			conn, err := grpc.NewClient("localhost:50051", grpc.WithInsecure())
			if err != nil {
				fmt.Println("❌ Failed to connect to gRPC server:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "grpc connection failed"})
				return
			}
			defer conn.Close()

			client := pb.NewPullRequestServiceClient(conn)

			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			token, email, err := s.db.GetProfileByGithubUrl(payload.Repository.FullName)
			if err != nil {
				fmt.Println("❌ Failed to get profile from DB:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "profile lookup failed"})
				return
			}
			req := &pb.Request{
				PrNumber:    int32(payload.Number),
				RepoUrl:     payload.Repository.FullName,
				Branch:      payload.PullRequest.Base.Ref,
				CommitHash:  payload.PullRequest.Head.SHA,
				Author:      payload.PullRequest.User.Login,
				Title:       payload.PullRequest.Title,
				Description: "Merged PR from webhook",
				AccessToken: token, // uses token from Server struct
				Email:       email,
			}

			_, err = client.ProcessPullRequest(ctx, req)
			if err != nil {
				fmt.Println("❌ gRPC call failed:", err)
			} else {
				fmt.Println("📨 PR sent to gRPC service successfully")
			}
		}

	default:
		fmt.Println("ℹ️ Ignoring event:", event)
	}

	c.JSON(http.StatusOK, gin.H{"status": "processed"})
}