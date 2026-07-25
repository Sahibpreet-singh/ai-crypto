from pydantic import BaseModel


class PumpEventSchema(BaseModel):
    id: int
    symbol: str
    event_type: str          # "PUMP" | "DUMP"
    price_start: float
    price_end: float
    change_pct: float
    window_start_ms: int
    window_end_ms: int

    class Config:
        from_attributes = True
