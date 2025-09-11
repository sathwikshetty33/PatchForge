package api

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "io"
    "net/http"

    "github.com/gin-gonic/gin"
)

type PushPayload struct {
    Ref        string `json:"ref"`
    Repository struct {
        Name     string `json:"name"`
        FullName string `json:"full_name"`
    } `json:"repository"`
    Pusher struct {
        Name  string `json:"name"`
        Email string `json:"email"`
    } `json:"pusher"`
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

        // You can now trigger your analysis here (CI/CD, build jobs, etc.)

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

        }

    default:
        fmt.Println("ℹ️ Ignoring event:", event)
    }

    c.JSON(http.StatusOK, gin.H{"status": "processed"})
}
