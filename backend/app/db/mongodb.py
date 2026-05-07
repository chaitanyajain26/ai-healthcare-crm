from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import PyMongoError
from app.core.config import settings

client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    global client, database
    client = AsyncIOMotorClient(settings.mongo_uri, serverSelectionTimeoutMS=5000)
    database = client[settings.mongo_db]
    try:
        await database["interactions"].create_index("hcp_name")
        await database["interactions"].create_index("created_at")
        await database["ai_activity_logs"].create_index("created_at")
    except PyMongoError:
        # Keep API startup resilient. CRUD endpoints return a clear 503 if MongoDB is still unavailable.
        return


async def close_mongo_connection() -> None:
    if client:
        client.close()


def get_database() -> AsyncIOMotorDatabase:
    if database is None:
        raise RuntimeError("MongoDB connection has not been initialized")
    return database
