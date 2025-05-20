# Sistema de Monitoramento de Motoristas - Distribuidora RJ

Sistema de monitoramento em tempo real para motoristas de uma empresa distribuidora no estado do Rio de Janeiro.

## Funcionalidades

- Visualização em tempo real da localização dos motoristas em um mapa
- Histórico de rotas percorridas
- Filtragem por status, cidade e período
- Detalhes dos motoristas e suas cargas
- Interface responsiva e intuitiva

## Tecnologias utilizadas

- React com Vite
- Leaflet para mapas interativos
- Componentes modularizados com CSS independente

## Requisitos

- Node.js 14+ e npm

## Instalação

```bash
# Clonar o repositório
git clone https://seu-repositorio/distribuidor-tracking.git
cd distribuidor-tracking

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Estrutura do projeto

```
distribuidor-tracking/
├── public/
│   └── images/                 # Imagens para o Leaflet
│       ├── marker-icon.png
│       ├── marker-icon-2x.png
│       └── marker-shadow.png
├── src/
│   ├── components/             # Componentes React
│   │   ├── DriverDetails/      # Detalhes do motorista
│   │   ├── DriverList/         # Lista de motoristas
│   │   ├── FilterPanel/        # Filtros de visualização
│   │   ├── Header/             # Cabeçalho da aplicação
│   │   └── Map/                # Mapa com Leaflet
│   ├── App.jsx                 # Componente principal
│   ├── App.css                 # Estilos principais
│   ├── index.css               # Estilos globais
│   ├── main.jsx                # Ponto de entrada
│   └── mockData.js             # Dados de exemplo para desenvolvimento
├── index.html                  # Template HTML principal
├── vite.config.js              # Configuração do Vite
├── package.json                # Dependências e scripts
└── README.md                   # Documentação
```

## Integração com o Backend

O sistema foi projetado para se integrar com um backend em Go. Para conectar com seu backend:

1. Em `App.jsx`, descomente o código para buscar dados da API real:
   ```javascript
   // Substituir:
   const data = await mockAPI.getDrivers();
   
   // Por:
   const response = await fetch('http://localhost:8080/api/drivers');
   const data = await response.json();
   ```

2. Ajuste a URL para corresponder ao seu serviço de tracking

## Próximos passos para desenvolvimento

- Implementação do módulo de estoque
- Autenticação de usuários
- Dashboard integrado
- Relatórios e métricas
- Notificações em tempo real

## Licença

Este projeto está licenciado sob a licença MIT.

## Contato

Para mais informações, entre em contato com a equipe de desenvolvimento.