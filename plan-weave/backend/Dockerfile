# ========================
# BUILD STAGE
# ========================
FROM golang:1.23.3-alpine AS builder

# Enable go modules
ENV GO111MODULE=on

# Install git for go get
RUN apk add --no-cache git

# Set working directory inside container
WORKDIR /app

# Copy only backend code
COPY go.mod go.sum ./
RUN go mod download

COPY . ./

# Build Go binary
RUN go build -o plan-weave

# ========================
# FINAL RUNTIME STAGE
# ========================
FROM alpine:latest

# Install CA certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/plan-weave .

# Expose API port
EXPOSE 8080

# Run web server
CMD ["./plan-weave"]