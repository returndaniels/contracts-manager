# Contracts Manager API (FastAPI)

## Run locally
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # on Windows use .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs

## Seed the database
```bash
python -m app.seed
```

## Tests
```bash
pytest
```

## Environment
- `DATABASE_URL` (default: `sqlite:///./contracts.db`)
