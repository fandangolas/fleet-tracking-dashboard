import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Esse é um componente mais simples para testes, focado apenas em exibir o mapa

function LeafletMap() {
  const mapContainerRef = useRef(null);
  
  useEffect(() => {
    // Certifique-se de que o container existe
    if (!mapContainerRef.current) return;
    
    // Esperar um pouco para garantir que o DOM esteja pronto
    setTimeout(() => {
      console.log("Inicializando mapa simples");
      
      try {
        // Inicializar o mapa com opções básicas
        const map = L.map(mapContainerRef.current, {
          center: [-22.9068, -43.1729],
          zoom: 10,
        });
        
        // Adicionar camada de tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Adicionar um marcador simples
        L.marker([-22.9068, -43.1729]).addTo(map)
          .bindPopup('Rio de Janeiro')
          .openPopup();
        
        console.log("Mapa inicializado com sucesso");
        
        // Invalidar o tamanho do mapa para forçar recálculo de dimensões
        setTimeout(() => {
          map.invalidateSize();
          console.log("Tamanho do mapa invalidado");
        }, 500);
        
        // Limpar ao desmontar
        return () => {
          map.remove();
          console.log("Mapa removido");
        };
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
      }
    }, 500);
  }, []);
  
  return (
    <div 
      ref={mapContainerRef} 
      style={{ 
        width: '100%', 
        height: '400px', 
        background: '#f0f0f0',
        border: '1px solid #ccc'
      }}
    ></div>
  );
}

export default LeafletMap;