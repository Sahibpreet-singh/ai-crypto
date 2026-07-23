import json
from app.database.database import SessionLocal
from app.services.trade_service import save_trade
from confluent_kafka import Consumer


consumer = Consumer(
    {
        "bootstrap.servers": "localhost:9092",
        "group.id": "trade-consumer-group",
        "auto.offset.reset": "earliest",
    }
)

consumer.subscribe(["trade_events"])

print("Waiting for trades...\n")

try:
    while True:
        msg = consumer.poll(1.0)

        if msg is None:
            continue

        if msg.error():
            print(msg.error())
            continue

        trade = json.loads(msg.value().decode("utf-8"))

        db = SessionLocal()

        try:
            save_trade(db, trade)
            print(f"Saved Trade: {trade['s']}")

        finally:
            db.close()

except KeyboardInterrupt:
    print("\nStopping consumer...")

finally:
    consumer.close()