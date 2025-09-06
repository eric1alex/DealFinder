import motor.motor_asyncio
from .config import settings

class DataBase:
    client: motor.motor_asyncio.AsyncIOMotorClient = None

db = DataBase()

def get_database() -> motor.motor_asyncio.AsyncIOMotorDatabase:
    return db.client[settings.MONGODB_DBNAME]

async def connect_to_mongo():
    """Connect to MongoDB."""
    print("Connecting to MongoDB...")
    db.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
    # Ping the server to check the connection.
    try:
        await db.client.admin.command('ping')
        print("Successfully connected to MongoDB.")
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
        # In a real app, you might want to exit or handle this more gracefully
        raise e


async def close_mongo_connection():
    """Close MongoDB connection."""
    print("Closing MongoDB connection.")
    db.client.close()
    print("MongoDB connection closed.")
