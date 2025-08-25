from datetime import datetime, date
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field

class ContractStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    SUSPENDED = "suspended"
    TERMINATED = "terminated"
    EXPIRED = "expired"

class ContractBase(SQLModel):
    number: str = Field(index=True, description="Contract number or code")
    supplier: str = Field(index=True)
    description: Optional[str] = None
    responsible: str = Field(index=True)
    status: ContractStatus = Field(default=ContractStatus.PENDING, index=True)
    value: float = Field(ge=0, index=True)
    category: str = Field(index=True)
    start_date: date
    end_date: date

class Contract(ContractBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ContractCreate(ContractBase):
    pass

class ContractRead(ContractBase):
    id: int
    created_at: datetime
    updated_at: datetime

class ContractUpdate(SQLModel):
    number: Optional[str] = None
    supplier: Optional[str] = None
    description: Optional[str] = None
    responsible: Optional[str] = None
    status: Optional[ContractStatus] = None
    value: Optional[float] = None
    category: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
