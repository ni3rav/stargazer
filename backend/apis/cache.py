import os

import redis
from dotenv import load_dotenv

load_dotenv()

__redis_client = None


def redis_conn():
    global __redis_client
    if not __redis_client:
        __redis_client = redis.Redis(
            host=os.environ["REDIS_HOST"],
            port=int(os.environ["REDIS_PORT"]),
            password=os.environ["REDIS_PASSWORD"],
            decode_responses=True,
        )

    __redis_client.ping()

    return __redis_client


def redis_close():
    if __redis_client:
        __redis_client.close()
