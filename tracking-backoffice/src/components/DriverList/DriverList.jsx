import './DriverList.css';

function DriverList({ drivers, selectedDriver, onDriverSelect, loading }) {
  if (loading) {
    return (
      <div className="driver-list">
        <div className="driver-list-header">
          <h2>Lista de Motoristas</h2>
        </div>
        <div className="drivers loading">
          <p>Carregando motoristas...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="driver-list">
      <div className="driver-list-header">
        <h2>Lista de Motoristas</h2>
      </div>
      
      <div className="drivers">
        {drivers.length === 0 ? (
          <div className="no-drivers">
            <p>Nenhum motorista encontrado</p>
          </div>
        ) : (
          drivers.map(driver => (
            <div 
              key={driver.id} 
              className={`driver-item ${selectedDriver && selectedDriver.id === driver.id ? 'selected' : ''}`}
              onClick={() => onDriverSelect(driver)}
            >
              <div className={`status-indicator ${driver.status === 'moving' ? 'active' : 'inactive'}`}></div>
              <div className="driver-info">
                <h3 className="driver-name">{driver.name}</h3>
                <p className="driver-details">
                  Caminhão #{driver.truckId} • {driver.status === 'moving' ? 'Em rota' : 'Parado'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DriverList;