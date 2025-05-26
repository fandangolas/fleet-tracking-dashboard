package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/nats-io/nats.go"
)

type Localizacao struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timestamp string  `json:"timestamp"`
}

func main() {
	// Conectar ao NATS
	nc, err := nats.Connect("nats://nats:4222")
	if err != nil {
		panic(err)
	}
	defer nc.Drain()

	js, err := nc.JetStream()
	if err != nil {
		panic(err)
	}

	// Criar o stream se não existir
	streamName := "DRIVERS"
	_, err = js.StreamInfo(streamName)
	if err != nil {
		fmt.Println("Stream não existe, criando...")
		_, err = js.AddStream(&nats.StreamConfig{
			Name:     streamName,
			Subjects: []string{"location.drivers.*"},
		})
		if err != nil {
			panic(fmt.Sprintf("Erro criando stream: %v", err))
		}
		fmt.Println("Stream criado com sucesso!")
	}

	// Ler o arquivo JSON
	data, err := os.ReadFile("fake-locations.json")
	if err != nil {
		panic(fmt.Sprintf("An error occurred while trying to read json: %v", err))
	}

	var locations []Localizacao
	if err := json.Unmarshal(data, &locations); err != nil {
		panic(fmt.Sprintf("An error occurred while trying to parse json: %v", err))
	}

	// Enviar cada localização a cada 10 segundos
	for _, loc := range locations {
		msg, err := json.Marshal(loc)
		if err != nil {
			fmt.Printf("Erro convertendo para JSON: %v\n", err)
			continue
		}

		ack, err := js.Publish("location.drivers.M1", msg)
		if err == nil {
			fmt.Printf("Publicado com ack: %+v\n", ack)
		} else {
			fmt.Printf("Erro publicando no JetStream: %v\n", err)
		}

		time.Sleep(10 * time.Second)
	}

	fmt.Println("Simulação finalizada.")
}
