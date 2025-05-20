package main

import (
	"log"

	"github.com/nats-io/nats.go"
)

func main() {
	// Conectando ao NATS
	nc, err := nats.Connect("nats://localhost:4222")
	if err != nil {
		log.Fatalf("Erro ao conectar ao NATS: %v", err)
	}
	defer nc.Drain()

	// Inicializando o JetStream
	js, err := nc.JetStream()
	if err != nil {
		log.Fatalf("Erro ao iniciar JetStream: %v", err)
	}

	// Limpando o stream DRIVERS
	err = js.PurgeStream("DRIVERS")
	if err != nil {
		log.Fatalf("Erro ao fazer purge do stream DRIVERS: %v", err)
	}

	log.Println("Stream DRIVERS limpo com sucesso!")
}
