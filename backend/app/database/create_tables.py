from app.database.base import Base
from app.database.database import engine

# Import every model here
from app.models.trade import Trade


def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")


if __name__ == "__main__":
    create_tables()