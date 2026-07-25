from pydantic import BaseModel


class VolumeSpikeSchema(BaseModel):
    id: int
    symbol: str
    current_volume: float
    average_volume: float
    volume_ratio: float
    trade_time_ms: int

    class Config:
        from_attributes = True


class VolumeRatioResponse(BaseModel):
    symbol: str
    current_volume: float
    average_volume: float
    volume_ratio: float
