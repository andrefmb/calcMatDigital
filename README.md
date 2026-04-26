# Calculadora de Maturidade Digital

Autodiagnóstico de maturidade digital baseado em framework de transformação digital com 4 dimensões estratégicas.

## Funcionalidades

- **Avaliação de Alunos** (`index.html`): Wizard com 8 perguntas contextualizadas em 4 dimensões (Tecnologia, Dados & Analytics, Processos Digitais, Pessoas & Cultura). Resultado imediato com gráfico radar e classificação (Starter → Leader).
- **Painel Admin** (`admin.html`): Criação de turmas, geração de links exclusivos, dashboard analítico com fortalezas e fraquezas da turma.

## Stack

- HTML, CSS e JavaScript puro (sem frameworks)
- Banco de dados: [Turso](https://turso.tech) (libSQL) via HTTP API
- Hospedagem: GitHub Pages

## Deploy

Este projeto é 100% estático. Basta ativar o GitHub Pages em **Settings → Pages → Deploy from branch → `main`**.

## Estrutura

```
├── index.html        # Avaliação do aluno
├── admin.html        # Painel administrativo
├── css/
│   └── style.css     # Design system
├── js/
│   ├── api.js        # Comunicação com Turso
│   ├── main.js       # Lógica do wizard do aluno
│   └── admin.js      # Lógica do painel admin
└── .gitignore
```

## Autor

Prof. Dr. André
