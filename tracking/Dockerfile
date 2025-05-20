FROM golang:1.21

WORKDIR /app
COPY . .

RUN go mod init consumidor && \
    go get github.com/nats-io/nats.go && \
    go build -o consumidor

CMD ["./consumidor"]
