# Guia de Implementação do Sistema de Monitoramento com Vite

Este guia explica como implementar o sistema de monitoramento de motoristas usando React com Vite, uma alternativa mais moderna e rápida ao Create React App.

## Visão Geral do Sistema

O sistema permite monitorar em tempo real a localização dos motoristas de uma empresa distribuidora no estado do Rio de Janeiro. Os principais recursos incluem:

- **Mapa Interativo**: Visualização da localização dos motoristas e suas rotas
- **Lista de Motoristas**: Exibição dos motoristas com status (em movimento/parado)
- **Filtros**: Opções para filtrar motoristas por status, cidade e período
- **Detalhes**: Painel com informações detalhadas do motorista selecionado

## Principais Componentes do Sistema

1. **Header**: Barra superior com navegação
2. **DriverList**: Lista de motoristas na barra lateral
3. **FilterPanel**: Painel de filtros para refinar a visualização
4. **Map**: Visualização do mapa com rotas e posições atuais
5. **DriverDetails**: Painel de informações do motorista selecionado

## Vantagens do Vite sobre Create React App

- **Tempo de desenvolvimento mais rápido**: O servidor de desenvolvimento do Vite inicia em segundos
- **Hot Module Replacement (HMR) eficiente**: As atualizações são instantâneas
- **Build otimizado**: Compilação mais rápida para produção
- **Configuração flexível**: Fácil personalização através do arquivo `vite.config.js`
- **Não precisa "ejetar"**: Todas as configurações são acessíveis por padrão

## Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Visualizar o build de produção localmente
npm run preview
```

## Integração com o Backend em Go

O sistema está preparado para integração com seu backend existente em Go. Para isso:

1. Localize o trecho abaixo em `App.jsx`:
```javascript
// Em ambiente de produção, usar a API real:
// const response = await fetch('http://localhost:8080/api/drivers');
// const data = await response.json();

// Para desenvolvimento, usar os dados de exemplo:
const data = await mockAPI.getDrivers();
```

2. Descomente as linhas para usar a API real e comente a linha que usa os dados de exemplo
3. Ajuste a URL para corresponder ao endereço do seu serviço de tracking

## Estrutura de Dados Esperada da API

A API de backend deve retornar dados no seguinte formato:

```json
[
  {
    "id": "string",
    "name": "string",
    "truckId": "string",
    "licensePlate": "string",
    "status": "moving|stopped",
    "origin": "string",
    "destination": "string",
    "currentCity": "string",
    "locationHistory": [
      {
        "lat": number,
        "lng": number,
        "timestamp": "ISO-string"
      }
    ],
    "cargo": {
      "description": "string",
      "weight": number
    }
  }
]
```

## Bibliotecas e Tecnologias Utilizadas

- **React 18**: Para construção da interface
- **Vite**: Como ferramenta de build e desenvolvimento
- **Leaflet**: Para renderização de mapas interativos
- **CSS Modular**: Cada componente com seu próprio arquivo CSS

## Personalização e Extensão

O sistema foi projetado para ser facilmente extensível. Você pode:

1. **Adicionar novos componentes**: Seguindo o mesmo padrão de organização
2. **Personalizar a aparência**: Editando os arquivos CSS
3. **Adicionar novas funcionalidades**: Como autenticação ou módulo de estoque
4. **Configurar o Vite**: Através do arquivo `vite.config.js`

## Dicas para Implementação do Módulo de Estoque

Para implementar o futuro módulo de estoque, recomendamos:

1. Criar uma nova página/rota para gestão de estoque
2. Desenvolver componentes específicos para:
   - Lista de produtos
   - Formulários de entrada/saída
   - Relatórios de estoque
3. Integrar com backend para persistência dos dados
4. Criar uma visão unificada que relacione produtos em estoque com cargas em trânsito

## Solução de Problemas Comuns

### Ícones do Leaflet não aparecem

Se os ícones do mapa não aparecerem, verifique se:

1. Os arquivos de imagem estão no diretório `public/images/`
2. O componente Map está configurado corretamente com os caminhos dos ícones

### Erro de CORS ao conectar com a API

Se encontrar erros de CORS:

1. Configure seu backend para permitir requisições do frontend
2. Adicione os cabeçalhos CORS apropriados no servidor Go

## Próximos Passos

1. **Autenticação**: Adicionar sistema de login
2. **Responsividade**: Adaptar para dispositivos móveis
3. **Notificações**: Alertas para eventos importantes
4. **Analytics**: Métricas de desempenho e eficiência de rotas

Este guia deve fornecer todas as informações necessárias para implementar e estender o sistema de monitoramento de motoristas usando React com Vite. Se tiver dúvidas adicionais, consulte a documentação ou entre em contato.