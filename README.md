# Tech Challenge — Gerenciador de Contratos

Aplicação full-stack (FastAPI + React) que atende aos requisitos de CRUD completo, filtros avançados, paginação, busca textual, visualização detalhada e interface responsiva.

## Como rodar rapidamente (modo dev)

### Backend (API)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# em outra aba:
python -m app.seed
```

A API sobe em `http://localhost:8000` (Swagger em `/docs`).

### Frontend (React Vite)
```bash
cd frontend
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

Frontend em `http://localhost:5173`.

## Testes
```bash
cd backend
pytest
```

## Deploy
- Pode usar Docker:
```bash
# na raiz
docker compose up --build
```
- Ou publicar a API (Docker) em qualquer cloud e apontar `VITE_API_URL` no frontend.

## Estrutura
- `backend/` FastAPI + SQLModel + SQLite
- `frontend/` React + TypeScript + Axios + React Router

## Features
- CRUD completo de contratos
- Filtros (fornecedor, status, valor min/max, categoria, período)
- Busca textual (número, fornecedor, descrição, responsável)
- Paginação (10 por página)
- Visualização detalhada
- Interface responsiva
- Seed de dados
