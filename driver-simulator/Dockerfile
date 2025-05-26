FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o driver-simulator main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
RUN adduser -D -s /bin/sh appuser
USER appuser
WORKDIR /app
COPY --from=builder /app/driver-simulator .
COPY --from=builder /app/fake-locations.json .
CMD ["./driver-simulator"]