# DRAWART - Versão React

Este projeto foi migrado de JavaScript vanilla para React com Vite.

## Estrutura do Projeto

```
DRAWART_/
├── src/
│   ├── components/
│   │   ├── Canvas.jsx          # Componente do canvas de desenho
│   │   ├── Navbar.jsx          # Barra de navegação superior
│   │   ├── Toolbar.jsx         # Barra de ferramentas
│   │   └── ColorPicker.jsx     # Seletor de cores
│   ├── hooks/
│   │   └── usePaint.js         # Hook customizado para lógica de desenho
│   ├── utils/
│   │   └── paint.js            # Funções utilitárias de desenho
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx               # Ponto de entrada da aplicação
│   └── style.css              # Estilos CSS
├── assets/                    # Assets (imagens, ícones)
├── index.html                 # HTML principal
├── package.json               # Dependências do projeto
└── vite.config.js            # Configuração do Vite
```

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Build para Produção

```bash
npm run build
```

## Características

- ✅ Migrado completamente para React
- ✅ Usa hooks personalizados (usePaint)
- ✅ Componentização modular
- ✅ Mantém todas as funcionalidades originais:
  - Desenhar com lápis, pincel, linhas, formas geométricas
  - Seletor de cores
  - Undo/Redo
  - Download de imagem
  - Compartilhamento
- ✅ Sem dependência de jQuery
- ✅ Código moderno e mantível

## Tecnologias Utilizadas

- React 18
- Vite
- Canvas API
- CSS3

