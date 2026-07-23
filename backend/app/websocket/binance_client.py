import asyncio
import json
import websockets
from app.kafka.producer import send_trade

BINANCE_WS = "wss://stream.binance.com:9443/ws/btcusdt@trade"

async def stream_trades():
    async with websockets.connect(BINANCE_WS) as websocket:
        print("Connected")

        while True:
            message = await websocket.recv()
            trade = json.loads(message)

            send_trade(trade)
            print(f"Sent Trade {trade['t']}")



if __name__ == "__main__":
    asyncio.run(stream_trades())