import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import './Map.css';

// Corrigir os ícones do Leaflet no Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

// Cores para diferenciar rotas de diferentes motoristas
const DRIVER_COLORS = [
  '#e74c3c', // vermelho
  '#3498db', // azul
  '#2ecc71', // verde
  '#f39c12', // laranja
  '#9b59b6', // roxo
  '#1abc9c', // turquesa
  '#34495e'  // azul escuro
];

function Map({ drivers, selectedDriver, onDriverSelect, loading }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const routesRef = useRef({});
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Inicializar o mapa
  useEffect(() => {
    console.log("Iniciando efeito de inicialização do mapa");
    console.log("Estado do mapRef:", mapRef.current ? "existe" : "não existe");
    console.log("Estado do mapInstanceRef:", mapInstanceRef.current ? "existe" : "não existe");
    
    const initializeMap = () => {
      console.log("Tentando inicializar o mapa");
      if (mapRef.current && !mapInstanceRef.current) {
        try {
          console.log("Elemento do mapa encontrado, criando instância do Leaflet");
          
          // Coordenadas centrais do Rio de Janeiro
          const center = [-22.9068, -43.1729]; 
          
          // Criar instância do mapa
          mapInstanceRef.current = L.map(mapRef.current, {
            center: center,
            zoom: 10,
            attributionControl: true,
            zoomControl: false // Desativar controles de zoom padrão
          });
          
          console.log("Instância do mapa criada, adicionando camada de tiles");
          
          // Adicionar camada de tiles (mapa base)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstanceRef.current);
          
          console.log("Camada de tiles adicionada, adicionando cidades");
          
          // Adicionar algumas cidades do Rio de Janeiro
          const cities = [
            { name: 'Rio de Janeiro', coords: [-22.9068, -43.1729] },
            { name: 'Niterói', coords: [-22.8858, -43.1155] },
            { name: 'Duque de Caxias', coords: [-22.7731, -43.3122] },
            { name: 'Nova Iguaçu', coords: [-22.7592, -43.4511] }
          ];
          
          cities.forEach(city => {
            L.circle(city.coords, {
              color: '#34495e',
              fillColor: '#34495e',
              fillOpacity: 0.8,
              radius: 2000
            }).addTo(mapInstanceRef.current)
            .bindTooltip(city.name);
          });
          
          console.log("Cidades adicionadas, mapa inicializado com sucesso");
          // Invalidar tamanho depois que o mapa é renderizado
          setTimeout(() => {
            mapInstanceRef.current.invalidateSize();
            console.log("Tamanho do mapa invalidado");
          }, 100);
          
          setMapReady(true);
          setMapError(null);
        } catch (error) {
          console.error("Erro ao inicializar o mapa:", error);
          setMapError(`Erro ao inicializar mapa: ${error.message}`);
        }
      } else {
        console.log("Não foi possível inicializar o mapa: ", 
          mapRef.current ? "mapRef existe" : "mapRef não existe", 
          mapInstanceRef.current ? "mapInstanceRef já existe" : "mapInstanceRef não existe");
      }
    };
    
    // Pequeno timeout para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      initializeMap();
    }, 500); // Aumentado para 500ms
    
    // Limpar mapa e timer ao desmontar
    return () => {
      console.log("Desmontando componente do mapa, limpando recursos");
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        console.log("Removendo instância do mapa");
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Atualizar tamanho do mapa quando a janela for redimensionada
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current && mapReady) {
        console.log("Redimensionando o mapa");
        mapInstanceRef.current.invalidateSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mapReady]);

  // Atualizar marcadores dos motoristas no mapa
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) {
      console.log("Não atualizando marcadores: mapa não está pronto");
      return;
    }
    
    if (!drivers || !drivers.length) {
      console.log("Não atualizando marcadores: não há motoristas para mostrar");
      return;
    }
    
    console.log("Atualizando marcadores para", drivers.length, "motoristas");
    const map = mapInstanceRef.current;
    
    // Limpar marcadores antigos
    Object.values(markersRef.current).forEach(marker => {
      map.removeLayer(marker);
    });
    
    // Limpar rotas antigas
    Object.values(routesRef.current).forEach(route => {
      map.removeLayer(route);
    });
    
    // Resetar referências
    markersRef.current = {};
    routesRef.current = {};
    
    // Adicionar novos marcadores e rotas para cada motorista
    drivers.forEach((driver, index) => {
      const color = DRIVER_COLORS[index % DRIVER_COLORS.length];
      
      // Apenas adicionar se tiver histórico de localização
      if (driver.locationHistory && driver.locationHistory.length > 0) {
        // Pegar a localização mais recente
        const currentLocation = driver.locationHistory[driver.locationHistory.length - 1];
        
        // Criar ícone personalizado para caminhões
        const truckIcon = L.divIcon({
          className: 'custom-truck-marker',
          html: `<div style="background-color: white; border: 2px solid ${color}; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">
                   <span style="font-size: 16px;">🚚</span>
                 </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        // Criar marcador para a posição atual
        const marker = L.marker([currentLocation.lat, currentLocation.lng], { 
          icon: truckIcon,
          zIndexOffset: selectedDriver && selectedDriver.id === driver.id ? 1000 : 0
        }).addTo(map);
        
        // Adicionar popup
        marker.bindPopup(`
          <strong>${driver.name}</strong><br>
          Caminhão #${driver.truckId}<br>
          Status: ${driver.status === 'moving' ? 'Em rota' : 'Parado'}<br>
          <button class="marker-select-btn">Ver detalhes</button>
        `);
        
        // Adicionar evento ao botão do popup
        marker.on('popupopen', () => {
          setTimeout(() => {
            const btn = document.querySelector('.marker-select-btn');
            if (btn) {
              btn.addEventListener('click', () => {
                onDriverSelect(driver);
                marker.closePopup();
              });
            }
          }, 10);
        });
        
        // Salvar referência do marcador
        markersRef.current[driver.id] = marker;
        
        // Criar linha da rota com o histórico de localização
        if (driver.locationHistory.length > 1) {
          const routePoints = driver.locationHistory.map(loc => [loc.lat, loc.lng]);
          
          const route = L.polyline(routePoints, {
            color: color,
            weight: 3,
            opacity: 0.7
          }).addTo(map);
          
          // Salvar referência da rota
          routesRef.current[driver.id] = route;
        }
      }
    });
    
    // Se houver um motorista selecionado, centralizar no mapa
    if (selectedDriver && selectedDriver.locationHistory && selectedDriver.locationHistory.length > 0) {
      const currentLocation = selectedDriver.locationHistory[selectedDriver.locationHistory.length - 1];
      map.setView([currentLocation.lat, currentLocation.lng], 12);
      
      // Abrir popup do motorista selecionado
      const marker = markersRef.current[selectedDriver.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [drivers, selectedDriver, onDriverSelect, mapReady]);

  // Forçar uma atualização do tamanho do mapa quando o componente estiver montado
  useEffect(() => {
    if (mapReady && mapInstanceRef.current) {
      setTimeout(() => {
        console.log("Forçando atualização do tamanho do mapa");
        mapInstanceRef.current.invalidateSize();
      }, 1000);
    }
  }, [mapReady]);

  return (
    <div className="map-container">
      {loading ? (
        <div className="map-loading">
          <p>Carregando mapa...</p>
        </div>
      ) : (
        <>
          <div ref={mapRef} className="map" id="map"></div>
          {mapError && (
            <div className="map-error">
              <p>{mapError}</p>
              <button onClick={() => window.location.reload()}>Recarregar página</button>
            </div>
          )}
          <div className="map-controls">
            {mapReady && (
              <>
                <button onClick={() => mapInstanceRef.current.zoomIn()} className="zoom-btn zoom-in">+</button>
                <button onClick={() => mapInstanceRef.current.zoomOut()} className="zoom-btn zoom-out">−</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Map;