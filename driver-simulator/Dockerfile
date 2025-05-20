FROM golang:1.21

WORKDIR /app
COPY . .

RUN go mod init simulador && \
    go get github.com/nats-io/nats.go && \
    go build -o simulador

CMD ["./simulador"]
