from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import date
from .database import init_db, get_session
from .models import Contract, ContractCreate, ContractRead, ContractUpdate, ContractStatus
from . import crud
from sqlmodel import select

app = FastAPI(title="Contracts Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/contracts", response_model=dict)
def list_contracts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    q: Optional[str] = None,
    supplier: Optional[str] = None,
    status: Optional[ContractStatus] = None,
    category: Optional[str] = None,
    value_min: Optional[float] = Query(None, ge=0),
    value_max: Optional[float] = Query(None, ge=0),
    start_from: Optional[date] = None,
    end_to: Optional[date] = None,
):
    with get_session() as session:
        return crud.list_contracts(
            session,
            page=page,
            page_size=page_size,
            q=q,
            supplier=supplier,
            status=status,
            category=category,
            value_min=value_min,
            value_max=value_max,
            start_from=start_from,
            end_to=end_to,
        )

@app.get("/contracts/{contract_id}", response_model=ContractRead)
def get_contract(contract_id: int):
    with get_session() as session:
        obj = crud.get_contract(session, contract_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Contract not found")
        return obj

@app.post("/contracts", status_code=201, response_model=ContractRead)
def create_contract(data: ContractCreate):
    with get_session() as session:
        obj = crud.create_contract(session, data)
        return obj

@app.put("/contracts/{contract_id}", response_model=ContractRead)
def update_contract(contract_id: int, data: ContractUpdate):
    with get_session() as session:
        obj = crud.update_contract(session, contract_id, data)
        if not obj:
            raise HTTPException(status_code=404, detail="Contract not found")
        return obj

@app.delete("/contracts/{contract_id}", status_code=204)
def delete_contract(contract_id: int):
    with get_session() as session:
        ok = crud.delete_contract(session, contract_id)
        if not ok:
            raise HTTPException(status_code=404, detail="Contract not found")
        return None
