import os
from dotenv import load_dotenv
from redis import Redis

load_dotenv()

redis_client = Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True,
)