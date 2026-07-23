from sqlalchemy import BigInteger, Boolean, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Trade(Base):
    __tablename__ = "trades"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    trade_id: Mapped[int] = mapped_column(
        BigInteger,
        unique=True,
        index=True,
    )

    symbol: Mapped[str] = mapped_column(
        String(20),
        index=True,
    )

    price: Mapped[float] = mapped_column(Float)

    quantity: Mapped[float] = mapped_column(Float)

    trade_time: Mapped[int] = mapped_column(BigInteger)

    is_market_maker: Mapped[bool] = mapped_column(Boolean)