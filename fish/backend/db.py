import asyncpg
import os

class PostgresDB:
    pool: asyncpg.Pool | None = None

    @classmethod
    async def connect(cls):
        if cls.pool is not None:
            return

        cls.pool = await asyncpg.create_pool(
            user=os.getenv("PG_USER", "postgres"),
            password=os.getenv("PG_PASSWORD", "postgres"),
            database=os.getenv("PG_DB", "fish"),
            host=os.getenv("PG_HOST", "localhost"),
            port=int(os.getenv("PG_PORT", 5432)),
            min_size=1,
            max_size=5
        )
import os
print("PG_USER =", os.getenv("PG_USER"))
print("PG_PASSWORD =", os.getenv("PG_PASSWORD"))
print("PG_DB =", os.getenv("PG_DB"))
print("PG_HOST =", os.getenv("PG_HOST"))
print("PG_PORT =", os.getenv("PG_PORT"))
