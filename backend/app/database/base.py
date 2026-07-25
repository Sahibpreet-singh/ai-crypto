from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

from app.models.trade import Trade
from app.models.whale_event import WhaleEvent