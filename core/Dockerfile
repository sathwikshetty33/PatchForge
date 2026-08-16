# ---- build stage ----
FROM golang:1.24-alpine AS build

WORKDIR /src

# Dependencies first so the module cache survives source-only changes.
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/core .

# ---- runtime stage ----
FROM alpine:3.20

# TLS roots are needed for the GitHub / Google API calls.
RUN apk add --no-cache ca-certificates \
    && adduser -D -u 10001 patchforge

WORKDIR /app
COPY --from=build /out/core /app/core

USER patchforge
EXPOSE 8080

ENTRYPOINT ["/app/core"]
CMD ["-addr", ":8080"]
