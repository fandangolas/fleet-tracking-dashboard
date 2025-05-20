import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import DriverList from './components/DriverList/DriverList';
import FilterPanel from './components/FilterPanel/FilterPanel';
import DriverDetails from './components/DriverDetails/DriverDetails';
import LeafletMap from './components/Map/LeafletMap';
// Importar dados de exemplo para desenvolvimento
import { mockAPI } from './mockData';

function App() {
  // Estado para armazenar dados dos motoristas
  const [drivers, setDrivers] = useState([]);
  // Estado para o motorista selecionado
  const [selectedDriver, setSelectedDriver] = useState(null);
  // Estado para filtros ativos
  const [filters, setFilters] = useState({
    status: 'all',
    cities: [],
    period: '24h'
  });
  // Estado para controlar carregamento
  const [loading, setLoading] = useState(true);
  // Estado para testar o mapa simplificado
  const [useSimpleMap, setUseSimpleMap] = useState(true);
  
  // Buscar dados dos motoristas da API
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        
        // Em ambiente de produção, usar a API real:
        // const response = await fetch('http://localhost:8080/api/drivers');
        // const data = await response.json();
        
        // Para desenvolvimento, usar os dados de exemplo:
        const data = await mockAPI.getDrivers();
        
        setDrivers(data);
        // Selecionar primeiro motorista como padrão se houver
        if (data.length > 0 && !selectedDriver) {
          setSelectedDriver(data[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar dados dos motoristas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Buscar dados iniciais
    fetchDrivers();
    
    // Configurar atualização periódica
    const interval = setInterval(fetchDrivers, 10000); // Atualizar a cada 10 segundos
    
    // Limpar intervalo ao desmontar
    return () => clearInterval(interval);
  }, [selectedDriver]);
  
  // Manipular seleção de motorista
  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
  };
  
  // Manipular alterações nos filtros
  const handleFilterChange = (newFilters) => {
    setFilters({...filters, ...newFilters});
  };
  
  // Filtrar motoristas com base nos filtros ativos
  const filteredDrivers = drivers.filter(driver => {
    // Filtrar por status
    if (filters.status !== 'all' && driver.status !== filters.status) {
      return false;
    }
    
    // Filtrar por cidade
    if (filters.cities.length > 0 && 
        !filters.cities.includes(driver.currentCity)) {
      return false;
    }
    
    // Filtrar por período (lógica simplificada)
    // Uma implementação real verificaria timestamps
    
    return true;
  });

  return (
    <div className="app">
      <Header />
      
      <div className="main-content">
        <div className="sidebar">
          <DriverList 
            drivers={filteredDrivers} 
            selectedDriver={selectedDriver}
            onDriverSelect={handleDriverSelect}
            loading={loading}
          />
          
          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          {/* Botão para alternar entre mapa completo e mapa simples (para testes) */}
          <div style={{ padding: '10px', textAlign: 'center' }}>
            <button 
              onClick={() => setUseSimpleMap(!useSimpleMap)}
              style={{
                padding: '8px 12px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {useSimpleMap ? 'Usar Mapa Complexo' : 'Usar Mapa Simples'}
            </button>
          </div>
        </div>
        
        <div className="content-area">
          {/* Usar o mapa simplificado para testar se o problema está no Leaflet básico */}
          {useSimpleMap ? (
            <div className="simple-map-container">
              <LeafletMap />
            </div>
          ) : (
            <div className="original-map-area">
              {/* Aqui poderia ficar o mapa original quando estiver funcionando */}
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#f5f5f5'
              }}>
                <p>Mapa original (desativado para teste)</p>
              </div>
            </div>
          )}
          
          {selectedDriver && (
            <DriverDetails driver={selectedDriver} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;