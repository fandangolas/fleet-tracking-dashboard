FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o tracking main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
# Create non-root user
RUN adduser -D -s /bin/sh appuser
USER appuser
WORKDIR /app
COPY --from=builder /app/tracking .
EXPOSE 8080
CMD ["./tracking"]