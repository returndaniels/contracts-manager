from typing import Optional, Tuple
from sqlmodel import select, col
from .models import Contract, ContractCreate, ContractUpdate, ContractStatus
from sqlalchemy import func
from datetime import date

def list_contracts(
    session,
    page: int = 1,
    page_size: int = 10,
    q: Optional[str] = None,
    supplier: Optional[str] = None,
    status: Optional[ContractStatus] = None,
    category: Optional[str] = None,
    value_min: Optional[float] = None,
    value_max: Optional[float] = None,
    start_from: Optional[date] = None,
    end_to: Optional[date] = None,
):
    stmt = select(Contract)
    # Filters
    if supplier:
        stmt = stmt.where(col(Contract.supplier).ilike(f"%{supplier}%"))
    if status:
        stmt = stmt.where(Contract.status == status)
    if category:
        stmt = stmt.where(col(Contract.category).ilike(f"%{category}%"))
    if value_min is not None:
        stmt = stmt.where(Contract.value >= value_min)
    if value_max is not None:
        stmt = stmt.where(Contract.value <= value_max)
    if start_from is not None:
        stmt = stmt.where(Contract.start_date >= start_from)
    if end_to is not None:
        stmt = stmt.where(Contract.end_date <= end_to)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            (col(Contract.number).ilike(like))
            | (col(Contract.supplier).ilike(like))
            | (col(Contract.description).ilike(like))
            | (col(Contract.responsible).ilike(like))
        )
    # Count
    total = session.exec(stmt.with_only_columns(func.count(Contract.id))).one()
    # Pagination
    stmt = stmt.order_by(Contract.updated_at.desc()).offset((page - 1) * page_size).limit(page_size)
    items = session.exec(stmt).all()
    return {"items": items, "total": total, "page": page, "page_size": page_size}

def get_contract(session, contract_id: int) -> Optional[Contract]:
    return session.get(Contract, contract_id)

def create_contract(session, data: ContractCreate) -> Contract:
    obj = Contract.model_validate(data, update={"id": None})
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj

def update_contract(session, contract_id: int, data: ContractUpdate) -> Optional[Contract]:
    obj = session.get(Contract, contract_id)
    if not obj:
        return None
    data_dict = data.model_dump(exclude_unset=True)
    for k, v in data_dict.items():
        setattr(obj, k, v)
    from datetime import datetime
    obj.updated_at = datetime.utcnow()
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj

def delete_contract(session, contract_id: int) -> bool:
    obj = session.get(Contract, contract_id)
    if not obj:
        return False
    session.delete(obj)
    session.commit()
    return True
