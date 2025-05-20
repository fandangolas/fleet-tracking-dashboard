import './FilterPanel.css';

function FilterPanel({ filters, onFilterChange }) {
  const cities = [
    { id: 'rio', name: 'Rio' },
    { id: 'niteroi', name: 'Niterói' },
    { id: 'duque_caxias', name: 'Duque de Caxias' },
    { id: 'nova_iguacu', name: 'Nova Iguaçu' }
  ];

  const periods = [
    { id: '1h', name: 'Última hora' },
    { id: '6h', name: 'Últimas 6 horas' },
    { id: '12h', name: 'Últimas 12 horas' },
    { id: '24h', name: 'Últimas 24 horas' },
    { id: '7d', name: 'Últimos 7 dias' }
  ];

  // Alternar status
  const handleStatusChange = (status) => {
    onFilterChange({ status });
  };

  // Alternar cidade na seleção
  const handleCityToggle = (cityId) => {
    let newCities = [...filters.cities];
    
    if (newCities.includes(cityId)) {
      // Remover cidade se já estiver selecionada
      newCities = newCities.filter(id => id !== cityId);
    } else {
      // Adicionar cidade se não estiver selecionada
      newCities.push(cityId);
    }
    
    onFilterChange({ cities: newCities });
  };

  // Alterar período
  const handlePeriodChange = (e) => {
    onFilterChange({ period: e.target.value });
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>Filtros</h2>
      </div>
      
      <div className="filter-section">
        <h3>Status:</h3>
        <div className="status-buttons">
          <button 
            className={`status-btn all ${filters.status === 'all' ? 'active' : ''}`}
            onClick={() => handleStatusChange('all')}
          >
            Todos
          </button>
          <button 
            className={`status-btn moving ${filters.status === 'moving' ? 'active' : ''}`}
            onClick={() => handleStatusChange('moving')}
          >
            Em rota
          </button>
          <button 
            className={`status-btn stopped ${filters.status === 'stopped' ? 'active' : ''}`}
            onClick={() => handleStatusChange('stopped')}
          >
            Parado
          </button>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Cidades:</h3>
        <div className="city-checkboxes">
          {cities.map(city => (
            <div key={city.id} className="city-checkbox">
              <input
                type="checkbox"
                id={`city-${city.id}`}
                checked={filters.cities.includes(city.id)}
                onChange={() => handleCityToggle(city.id)}
              />
              <label htmlFor={`city-${city.id}`}>{city.name}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Período:</h3>
        <select 
          className="period-select"
          value={filters.period}
          onChange={handlePeriodChange}
        >
          {periods.map(period => (
            <option key={period.id} value={period.id}>
              {period.name}
            </option>
          ))}
        </select>
      </div>
      
      <button 
        className="reset-filters-btn"
        onClick={() => onFilterChange({
          status: 'all',
          cities: [],
          period: '24h'
        })}
      >
        Resetar Filtros
      </button>
    </div>
  );
}

export default FilterPanel;