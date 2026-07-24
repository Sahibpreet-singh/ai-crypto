import json

from confluent_kafka import Consumer

from app.database.database import SessionLocal
from app.mappers.binance_mapper import BinanceMapper
from app.processors.trade_processor import TradeProcessor


consumer = Consumer(
    {
        "bootstrap.servers": "localhost:9092",
        "group.id": "trade-consumers",
        "auto.offset.reset": "latest",
    }
)

consumer.subscribe(["trade_events"])


def consume():

    print("Kafka Consumer Started...")

    while True:

        msg = consumer.poll(1.0)

        if msg is None:
            continue

        if msg.error():
            print(msg.error())
            continue

        trade_json = json.loads(msg.value().decode())

        trade = BinanceMapper.map_trade(trade_json)

        db = SessionLocal()

        try:
            processor = TradeProcessor(db)
            processor.process_trade(trade)

            print(f"Processed {trade.symbol} | {trade.price}")

        finally:
            db.close()


if __name__ == "__main__":
    consume()