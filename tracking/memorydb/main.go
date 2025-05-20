package memorydb

import (
	"sync"
	"time"
)

type Location struct {
	Latitude  float64
	Longitude float64
	Timestamp time.Time
}

type InMemoryDb struct {
	mu   sync.RWMutex
	data map[string][]Location // chave por ID de motorista, ex: "M1"
}

func NewDatabase() *InMemoryDb {
	return &InMemoryDb{
		data: make(map[string][]Location),
	}
}

func (db *InMemoryDb) AddLocation(driver string, loc Location) {
	db.mu.Lock()
	defer db.mu.Unlock()
	db.data[driver] = append(db.data[driver], loc)
}

func (db *InMemoryDb) GetLocations(driver string) []Location {
	db.mu.RLock()
	defer db.mu.RUnlock()
	return db.data[driver]
}

func (db *InMemoryDb) GetAll() map[string][]Location {
	return db.data
}
