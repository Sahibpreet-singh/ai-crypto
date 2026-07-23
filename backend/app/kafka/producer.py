import json

from confluent_kafka import Producer


producer = Producer(
    {
        "bootstrap.servers": "localhost:9092"
    }
)


TOPIC = "trade_events"


def send_trade(trade: dict):
    producer.produce(
        TOPIC,
        key=trade["s"],
        value=json.dumps(trade)
    )

    producer.poll(0)