// mockData.js
// Arquivo para simular dados da API para testes durante o desenvolvimento

// Coordenadas aproximadas de algumas cidades do Rio de Janeiro
const CITIES = {
  rio: {
    name: 'Rio de Janeiro',
    coords: [-22.9068, -43.1729]
  },
  niteroi: {
    name: 'Niterói',
    coords: [-22.8858, -43.1155]
  },
  duqueCaxias: {
    name: 'Duque de Caxias',
    coords: [-22.7731, -43.3122]
  },
  novaIguacu: {
    name: 'Nova Iguaçu',
    coords: [-22.7592, -43.4511]
  },
  saoPedro: {
    name: 'São Pedro da Aldeia',
    coords: [-22.8358, -42.1002]
  },
  buzios: {
    name: 'Armação dos Búzios',
    coords: [-22.7469, -41.8816]
  }
};

// Função para gerar pontos intermediários entre duas cidades
function generateRoute(start, end, points = 10) {
  const route = [];
  const [startLat, startLng] = start;
  const [endLat, endLng] = end;
  
  for (let i = 0; i <= points; i++) {
    const ratio = i / points;
    
    // Adicionar pequena variação para simular rota real (não uma linha reta perfeita)
    const jitter = (Math.random() - 0.5) * 0.005;
    
    const lat = startLat + (endLat - startLat) * ratio + jitter;
    const lng = startLng + (endLng - startLng) * ratio + jitter;
    
    // Calcular timestamp baseado no tempo
    const now = new Date();
    const timeOffset = i * 10 * 60000; // 10 minutos entre cada ponto
    const timestamp = new Date(now.getTime() - timeOffset).toISOString();
    
    route.push({
      lat,
      lng,
      timestamp
    });
  }
  
  return route;
}

// Gerar dados de motoristas fictícios
export const mockDrivers = [
  {
    id: '1',
    name: 'João Silva',
    truckId: '101',
    licensePlate: 'ABC-1234',
    status: 'moving',
    origin: CITIES.rio.name,
    destination: CITIES.niteroi.name,
    currentCity: 'rio',
    locationHistory: generateRoute(CITIES.rio.coords, CITIES.niteroi.coords, 15).reverse(),
    cargo: {
      description: 'Alimentos não perecíveis',
      weight: 2500
    }
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    truckId: '102',
    licensePlate: 'DEF-5678',
    status: 'moving',
    origin: CITIES.duqueCaxias.name,
    destination: CITIES.novaIguacu.name,
    currentCity: 'duqueCaxias',
    locationHistory: generateRoute(CITIES.duqueCaxias.coords, CITIES.novaIguacu.coords, 8).reverse(),
    cargo: {
      description: 'Produtos eletrônicos',
      weight: 1800
    }
  },
  {
    id: '3',
    name: 'Carlos Santos',
    truckId: '103',
    licensePlate: 'GHI-9012',
    status: 'stopped',
    origin: CITIES.rio.name,
    destination: CITIES.buzios.name,
    currentCity: 'rio',
    locationHistory: [
      {
        lat: CITIES.rio.coords[0] + 0.002,
        lng: CITIES.rio.coords[1] - 0.003,
        timestamp: new Date().toISOString()
      }
    ],
    cargo: {
      description: 'Material de construção',
      weight: 3200
    }
  },
  {
    id: '4',
    name: 'Ana Costa',
    truckId: '104',
    licensePlate: 'JKL-3456',
    status: 'moving',
    origin: CITIES.niteroi.name,
    destination: CITIES.saoPedro.name,
    currentCity: 'niteroi',
    locationHistory: generateRoute(CITIES.niteroi.coords, CITIES.saoPedro.coords, 20).reverse(),
    cargo: {
      description: 'Produtos farmacêuticos',
      weight: 1200
    }
  },
  {
    id: '5',
    name: 'Roberto Almeida',
    truckId: '105',
    licensePlate: 'MNO-7890',
    status: 'stopped',
    origin: CITIES.novaIguacu.name,
    destination: CITIES.duqueCaxias.name,
    currentCity: 'novaIguacu',
    locationHistory: [
      {
        lat: CITIES.novaIguacu.coords[0] - 0.001,
        lng: CITIES.novaIguacu.coords[1] + 0.002,
        timestamp: new Date().toISOString()
      }
    ],
    cargo: {
      description: 'Bebidas',
      weight: 2800
    }
  }
];

// Simular endpoint da API
export const mockAPI = {
  getDrivers: () => {
    return new Promise((resolve) => {
      // Simular delay da rede
      setTimeout(() => {
        resolve(mockDrivers);
      }, 300);
    });
  }
};