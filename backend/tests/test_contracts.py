import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, init_db
from sqlmodel import SQLModel

@pytest.fixture(autouse=True, scope="session")
def setup_db():
    # Recreate schema for tests (use in-memory sqlite for speed)
    from app.database import DATABASE_URL
    if DATABASE_URL.startswith("sqlite"):
        # ensure tables
        init_db()
    yield

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_crud_contracts_flow():
    # Create
    payload = {
        "number": "CTR-TEST-1",
        "supplier": "Test Supplier",
        "description": "Test Description",
        "responsible": "QA",
        "status": "active",
        "value": 1234.56,
        "category": "Testing",
        "start_date": "2024-01-01",
        "end_date": "2025-01-01"
    }
    res = client.post("/contracts", json=payload)
    assert res.status_code == 201, res.text
    created = res.json()
    cid = created["id"]

    # Read
    res = client.get(f"/contracts/{cid}")
    assert res.status_code == 200
    assert res.json()["number"] == "CTR-TEST-1"

    # List with filters
    res = client.get("/contracts", params={"q": "Test Supplier", "page_size": 10})
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert any(item["id"] == cid for item in data["items"])

    # Update
    res = client.put(f"/contracts/{cid}", json={"value": 9999.99})
    assert res.status_code == 200
    assert res.json()["value"] == 9999.99

    # Delete
    res = client.delete(f"/contracts/{cid}")
    assert res.status_code == 204

    # Not found after delete
    res = client.get(f"/contracts/{cid}")
    assert res.status_code == 404
