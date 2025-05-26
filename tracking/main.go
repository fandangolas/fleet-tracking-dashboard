package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"tracking/memorydb"

	"github.com/gorilla/mux"
	"github.com/nats-io/nats.go"
)

func generateTableHTML(data map[string][]memorydb.Location) string {
	html := `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Localizações dos Motoristas</title>
			<style>
				table {
					border-collapse: collapse;
					width: 100%;
				}
				th, td {
					border: 1px solid #ddd;
					padding: 8px;
				}
				th {
					background-color: #f2f2f2;
				}
			</style>
		</head>
		<body>
			<h1>Localizações dos Motoristas</h1>
			<table>
				<tr>
					<th>Motorista</th>
					<th>Latitude</th>
					<th>Longitude</th>
					<th>Timestamp</th>
				</tr>
	`

	for idMotorista, localizacoes := range data {
		for _, loc := range localizacoes {
			html += fmt.Sprintf(`
				<tr>
					<td>%s</td>
					<td>%.6f</td>
					<td>%.6f</td>
					<td>%s</td>
				</tr>
			`, idMotorista, loc.Latitude, loc.Longitude, loc.Timestamp)
		}
	}

	html += `
			</table>
		</body>
		</html>
	`

	return html
}

func pingHandler(db *memorydb.InMemoryDb) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		tabelaHTML := generateTableHTML(db.GetAll())
		w.Write([]byte(tabelaHTML))
	}
}

func startWebServer(db *memorydb.InMemoryDb) {
	router := mux.NewRouter()

	router.HandleFunc("/locations", pingHandler(db)).Methods("GET")

	fmt.Println("Server running @localhost:8080")
	log.Fatal(
		http.ListenAndServe(":8080", router),
	)
}

func startListeningStreams(db *memorydb.InMemoryDb) {
	const natsServerURL string = "nats://nats:4222"

	natsConnection, err := nats.Connect(natsServerURL)

	if err != nil {
		log.Fatal(err)
	}

	jetStreamConnection, err := natsConnection.JetStream()
	if err != nil {
		log.Fatal(err)
	}

	_, err = jetStreamConnection.AddStream(&nats.StreamConfig{
		Name:     "DRIVERS",
		Subjects: []string{"location.drivers.M1"},
		MaxAge:   time.Minute * 10,
	})
	if err != nil && err != nats.ErrStreamNameAlreadyInUse {
		log.Fatal(err)
	}

	const fakeDriverId = "M1"
	const driversTopic = "location.drivers"

	subscription, err := jetStreamConnection.PullSubscribe(
		strings.Join([]string{driversTopic, fakeDriverId}, "."),
		"tracking",
	)
	if err != nil {
		log.Fatal(err)
	}

	for {
		messages, err := subscription.Fetch(1)
		if err != nil {
			time.Sleep(10 * time.Second)
			continue
		}

		for _, message := range messages {
			var messageStr string = string(message.Data)
			fmt.Println("New location signal received: ", messageStr)

			var location memorydb.Location
			err := json.Unmarshal(message.Data, &location)
			if err != nil {
				log.Println("An error occurred while trying to parse the message into JSON: ", err)
				return
			}

			logLocation(location)
			db.AddLocation(fakeDriverId, location)
			message.Ack()
		}
	}
}

func logLocation(location memorydb.Location) {
	fmt.Printf("Latitude: %f\n", location.Latitude)
	fmt.Printf("Longitude: %f\n", location.Longitude)
	fmt.Printf("Timestamp: %s\n", location.Timestamp)
}

func main() {
	db := memorydb.NewDatabase()
	go startListeningStreams(db)
	startWebServer(db)
}
