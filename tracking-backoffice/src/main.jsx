import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Importação explícita do CSS do Leaflet - IMPORTANTE!
import 'leaflet/dist/leaflet.css'

// Garantir que o documento esteja completamente carregado antes de renderizar
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})