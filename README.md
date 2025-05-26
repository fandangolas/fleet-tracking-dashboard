# Fleet Tracking Dashboard

A comprehensive fleet tracking system built with Go, React, and NATS messaging. This system simulates vehicle locations, processes tracking data, and provides a web dashboard for fleet management.

## Architecture

The system consists of three main components:

- **Driver Simulator** - Simulates vehicle location data and publishes to NATS
- **Tracking Service** - Processes location data from NATS and provides HTTP API
- **Tracking Backoffice** - React web dashboard for fleet visualization and management

## Communication Flow

```
Driver Simulator → NATS JetStream → Tracking Service ← HTTP → React Dashboard
```

## Prerequisites

- Docker
- Docker Compose
- Go 1.23+ (for local development)
- Node.js 18+ (for local development)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/fandangolas/fleet-tracking-dashboard.git
   cd fleet-tracking-dashboard
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Web Dashboard: http://localhost:3000
   - Tracking API: http://localhost:8080
   - NATS Monitoring: http://localhost:8222

## Project Structure

```
fleet-tracking-dashboard/
├── docker-compose.yml
├── driver-simulator/
│   ├── Dockerfile
│   ├── main.go
│   ├── go.mod
│   ├── go.sum
│   └── fake-locations.json
├── tracking/
│   ├── Dockerfile
│   ├── main.go
│   ├── go.mod
│   └── go.sum
└── tracking-backoffice/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    └── src/
        └── ... (React components)
```

## Services

### Driver Simulator
- **Purpose**: Simulates GPS tracking data from fleet vehicles
- **Technology**: Go application
- **Communication**: Publishes location data to NATS JetStream
- **Data Source**: `fake-locations.json` file with predefined GPS coordinates
- **Publishing Interval**: Every 10 seconds

### Tracking Service
- **Purpose**: Central data processing and API service
- **Technology**: Go HTTP server
- **Communication**: 
  - Consumes messages from NATS JetStream
  - Provides REST API for the web dashboard
- **Port**: 8080

### Tracking Backoffice
- **Purpose**: Web dashboard for fleet management
- **Technology**: React application built with Vite
- **Communication**: HTTP requests to Tracking Service API
- **Port**: 3000

### NATS Server
- **Purpose**: Message broker for real-time communication
- **Features**: JetStream enabled for persistent messaging
- **Ports**: 
  - 4222 (NATS protocol)
  - 8222 (HTTP monitoring)

## Development

### Running Individual Services

**Driver Simulator:**
```bash
cd driver-simulator
go mod tidy
go run main.go
```

**Tracking Service:**
```bash
cd tracking
go mod tidy
go run main.go
```

**React Dashboard:**
```bash
cd tracking-backoffice
npm install
npm run dev
```

**NATS Server:**
```bash
# Using Docker
docker run -p 4222:4222 -p 8222:8222 nats:latest --jetstream
```

## Docker Configuration

### Environment Variables

**Driver Simulator & Tracking:**
- `NATS_URL`: NATS server connection URL (default: `nats://nats:4222`)

**Tracking Service:**
- `PORT`: HTTP server port (default: `8080`)

**React Dashboard:**
- `REACT_APP_API_URL`: Internal API URL for container communication
- `REACT_APP_API_URL_EXTERNAL`: External API URL for browser requests

### Volumes

- `nats_data`: Persistent storage for NATS JetStream data

## API Endpoints

The Tracking Service provides REST API endpoints (specific endpoints depend on your implementation):

```
GET /api/vehicles          # Get all vehicles
GET /api/vehicles/{id}     # Get specific vehicle
GET /api/locations         # Get location history
POST /api/...             # Additional endpoints
```

## Troubleshooting

### Common Issues

**NATS Connection Failed:**
- Ensure NATS service is running and accessible
- Check if JetStream is enabled: `--jetstream` flag

**Go Version Compatibility:**
- Ensure Docker images use Go 1.23+
- Update Dockerfile: `FROM golang:1.23-alpine`

**File Not Found in Container:**
- Verify all required files are copied in Dockerfile
- For data files, use: `COPY --from=builder /app/*.json .`

**React App API Calls:**
- Use `http://localhost:8080` for browser requests
- Internal container communication uses service names

### Logs

View service logs:
```bash
docker-compose logs driver-simulator
docker-compose logs tracking
docker-compose logs tracking-backoffice
docker-compose logs nats
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test with Docker Compose: `docker-compose up --build`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Technology Stack

- **Backend**: Go 1.23+
- **Frontend**: React 18+ with Vite
- **Message Broker**: NATS with JetStream
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for React app serving)