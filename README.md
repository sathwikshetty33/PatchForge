# PatchForge

🚀 **PatchForge** is a full-stack system that automates the analysis of merged pull requests. It listens to **GitHub webhooks**, processes PRs through a **Go server**, communicates with a **Python-based insights engine** via **gRPC**, and finally uses the **Groq API** to generate AI-powered release notes — which are emailed directly to repository contributors.

## 🔹 Key Features

* **GitHub Webhook Integration** - Automatically captures push and pull request events.
* **PR Analysis via gRPC** - The Go service forwards PR metadata (repo URL, commit hash, etc.) to the Python insights service.
* **AI-Powered Release Notes** - The Python service fetches the commit diff using the GitHub API, generates release notes using **Groq**, and formats them.
* **Automated Email Delivery** - Release notes are sent to the contributor's registered email using **SMTP**.
* **Database-backed Profiles & Tokens** - Secure storage of GitHub access tokens, repository details, and user profiles via **GORM + PostgreSQL/MySQL**.

## 🔹 System Architecture

### 1. GitHub Webhook → Go Server
* GitHub triggers webhook events (`push`, `pull_request`).
* The Go server validates payload signatures, extracts PR metadata, and retrieves tokens from the DB.

### 2. Go Server → Python Insights Service (gRPC)
* A gRPC client sends PR data (commit hash, repo URL, etc.) to the Python gRPC server.

### 3. Python Insights Service
* Uses GitHub API + access token to fetch PR diffs.
* Sends diffs to **Groq** for AI-generated release notes.
* Sends formatted notes via SMTP to the contributor.

### 4. End-to-End Flow
Developer merges PR → GitHub webhook fires → Go server processes → Python generates notes → Contributor gets email.

## 🔹 Tech Stack

### Backend (Go):
* Gin (API server & webhooks)
* gRPC client
* GORM ORM (Postgres/MySQL)
* Secure HMAC signature verification

### Insights Engine (Python):
* gRPC server
* Groq API for AI release notes
* smtplib for email delivery

### Inter-Service Communication:
* gRPC

### Database:
* PostgreSQL / MySQL

### Version Control & Events:
* GitHub Webhooks

## 🔹 Directory Structure

```
PatchForge/
│── core/                 # Go backend (webhooks + DB + gRPC client)
│   ├── api/              # Handles GitHub webhook events
│   ├── db/               # Database models (User, Profile, Repository)
│   ├── grpc_schema/      # Protobuf definitions for gRPC
│   ├── tokens/           # Token utilities
│   ├── utils/            # Configs, secrets, helpers
│   ├── main.go           # Entry point for Go server
│   ├── go.mod / go.sum   # Go dependencies
│   └── .env              # Environment variables (DB, secrets)
│
│── grpc/                 # Shared gRPC definitions
│
│── insights/             # Python-based insights service
│   ├── grpc_files/       # Generated gRPC Python code
│   ├── utils/            # Helper functions (SMTP, GitHub API)
│   ├── main.py           # Python service entry
│   ├── server.py         # gRPC server implementation
│   ├── pyproject.toml    # Python dependencies
│   └── .venv             # Python virtual environment
│
│── .gitignore
│── README.md             # Project documentation
```

## 🔹 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/sathwikshetty33/PatchForge.git
cd PatchForge
```

### 2. Setup Go Service (Webhook Listener + gRPC Client)

```bash
cd core
go mod tidy
go run main.go
```

* Ensure `.env` contains DB credentials and GitHub webhook secret.
* Expose your server to GitHub using **ngrok** or similar.

### 3. Setup Python Insights Service (gRPC Server + Groq + SMTP)

```bash
cd insights
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

* Configure `.env` with:
  * `SMTP_HOST`, `SMTP_PORT`, `EMAIL_USER`, `EMAIL_PASS`
  * `GROQ_API_KEY`

### 4. Configure GitHub Webhook
* Point repository webhook to your Go service (`/webhook`).
* Use the same **secret** configured in `.env`.
