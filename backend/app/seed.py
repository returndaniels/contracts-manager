from .database import init_db, get_session
from .models import Contract, ContractStatus
from datetime import date, timedelta
import random

suppliers = ["Acme Corp", "Globex", "Umbrella", "Initech", "Stark Industries", "Wayne Enterprises"]
categories = ["Cloud", "Consulting", "Licensing", "Maintenance", "Hardware", "Security"]
responsibles = ["Ana", "Bruno", "Carla", "Daniel", "Eduarda", "Felipe"]
descriptions = ["Support & SLA", "Annual subscription", "Upgrade project", "On-demand consulting", "Managed services"]

def run():
    init_db()
    from .database import get_session
    with get_session() as session:
        # Only seed if empty
        from sqlmodel import select
        if session.exec(select(Contract)).first():
            print("Database already seeded.")
            return
        today = date.today()
        for i in range(1, 51):
            start = today - timedelta(days=random.randint(0, 900))
            end = start + timedelta(days=random.randint(90, 720))
            status = random.choice(list(ContractStatus))
            c = Contract(
                number=f"CTR-{1000+i}",
                supplier=random.choice(suppliers),
                description=random.choice(descriptions),
                responsible=random.choice(responsibles),
                status=status,
                value=round(random.uniform(1000, 150000), 2),
                category=random.choice(categories),
                start_date=start,
                end_date=end,
            )
            session.add(c)
        session.commit()
        print("Seeded 50 contracts.")

if __name__ == "__main__":
    run()
