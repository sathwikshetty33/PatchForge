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
    Ref string `json:"ref"`
    Repository struct {
        Name string `json:"name"`
        FullName string `json:"full_name"`
    } `json:"repository"`
    Pusher struct {
        Name  string `json:"name"`
        Email string `json:"email"`
    } `json:"pusher"`
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
        fmt.Printf("❌ Signature mismatch\nExpected: sha256=%x\nGot: %s\n", hmac.New(sha256.New, []byte(secret)).Sum(nil), sig)
        c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid signature"})
        return
    }

    event := c.GetHeader("X-GitHub-Event")
    fmt.Println("✅ Received GitHub event:", event)

    var payload PushPayload
    if err := json.Unmarshal(body, &payload); err != nil {
        fmt.Println("❌ JSON decode failed:", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
        return
    }

    fmt.Printf("Push to %s by %s\n", payload.Repository.FullName, payload.Pusher.Name)

    c.JSON(http.StatusOK, gin.H{"status": "processed"})
}
