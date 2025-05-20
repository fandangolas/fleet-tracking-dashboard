import './DriverDetails.css';

function DriverDetails({ driver }) {
  // Função para formatar timestamp em horário legível
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // Calculando o tempo estimado de chegada (lógica simplificada)
  // Em uma implementação real, usaria dados de rota, distância e velocidade
  const calculateETA = () => {
    if (!driver.locationHistory || driver.locationHistory.length === 0) {
      return 'Indisponível';
    }
    
    // Para o exemplo, simplesmente adicionamos 1 hora ao timestamp atual
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return formatTime(now);
  };
  
  // Última atualização - pega o timestamp da última localização
  const getLastUpdate = () => {
    if (!driver.locationHistory || driver.locationHistory.length === 0) {
      return 'Indisponível';
    }
    
    const lastLocation = driver.locationHistory[driver.locationHistory.length - 1];
    return formatTime(lastLocation.timestamp);
  };

  return (
    <div className="driver-details">
      <div className="details-header">
        <h2>Detalhes do Motorista: {driver.name}</h2>
      </div>
      
      <div className="details-content">
        <div className="info-row">
          <div className="info-item">
            <span className="info-label">Placa:</span>
            <span className="info-value">{driver.licensePlate}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Caminhão:</span>
            <span className="info-value">#{driver.truckId}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className={`info-value status-${driver.status}`}>
              {driver.status === 'moving' ? 'Em rota' : 'Parado'}
            </span>
          </div>
        </div>
        
        <div className="info-row">
          <div className="info-item">
            <span className="info-label">Origem:</span>
            <span className="info-value">{driver.origin || 'N/A'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Destino:</span>
            <span className="info-value">{driver.destination || 'N/A'}</span>
          </div>
        </div>
        
        <div className="info-row">
          <div className="info-item">
            <span className="info-label">Última atualização:</span>
            <span className="info-value">{getLastUpdate()}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">ETA:</span>
            <span className="info-value">{calculateETA()}</span>
          </div>
        </div>
        
        <div className="info-row">
          <div className="info-item wide">
            <span className="info-label">Carga:</span>
            <span className="info-value">
              {driver.cargo ? 
                `${driver.cargo.description} (${driver.cargo.weight} kg)` : 
                'Nenhuma carga registrada'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="actions">
        <button className="action-btn contact">
          <span className="icon">📞</span> Contatar Motorista
        </button>
        
        <button className="action-btn route">
          <span className="icon">🗺️</span> Ver Rota Completa
        </button>
      </div>
    </div>
  );
}

export default DriverDetails;