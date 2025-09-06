import motor.motor_asyncio
from bson import ObjectId
from typing import List, Optional
import datetime

from . import schemas

# --- Helper function to get the 'deals' collection ---
def get_deals_collection(db: motor.motor_asyncio.AsyncIOMotorDatabase):
    return db["deals"]

# --- CRUD Functions ---

async def get_deal(db: motor.motor_asyncio.AsyncIOMotorDatabase, deal_id: str) -> Optional[schemas.Deal]:
    """Gets a single deal by its MongoDB ObjectId."""
    if not ObjectId.is_valid(deal_id):
        return None
    deal = await get_deals_collection(db).find_one({"_id": ObjectId(deal_id)})
    if deal:
        return schemas.Deal(**deal)
    return None

async def get_deals(
    db: motor.motor_asyncio.AsyncIOMotorDatabase,
    skip: int = 0,
    limit: int = 10,
    filter_by_category: Optional[str] = None,
    sort_by: Optional[str] = None
) -> List[schemas.Deal]:
    """Gets a list of deals with filtering, sorting, and pagination."""
    query = {}
    if filter_by_category:
        query["category"] = filter_by_category

    sort_options = []
    if sort_by:
        direction = -1  # Descending for discount, clicks, etc.
        if sort_by == 'price':
            direction = 1  # Ascending for price
        sort_options.append((sort_by, direction))

    cursor = get_deals_collection(db).find(query).skip(skip).limit(limit)
    if sort_options:
        cursor = cursor.sort(sort_options)

    deals = await cursor.to_list(length=limit)
    return [schemas.Deal(**deal) for deal in deals]

async def get_deal_by_product_id(db: motor.motor_asyncio.AsyncIOMotorDatabase, product_id: str, source: str) -> Optional[schemas.Deal]:
    """Finds a deal by its product ID and source."""
    deal = await get_deals_collection(db).find_one({"product_id": product_id, "source": source})
    if deal:
        return schemas.Deal(**deal)
    return None

async def create_deal(db: motor.motor_asyncio.AsyncIOMotorDatabase, deal: schemas.DealCreate) -> schemas.Deal:
    """Creates a new deal in the database."""
    deal_data = deal.dict()
    deal_data["created_at"] = datetime.datetime.utcnow()
    deal_data["clicks"] = 0

    result = await get_deals_collection(db).insert_one(deal_data)
    new_deal = await get_deals_collection(db).find_one({"_id": result.inserted_id})
    return schemas.Deal(**new_deal)

async def update_deal(db: motor.motor_asyncio.AsyncIOMotorDatabase, existing_deal: schemas.Deal, deal_update: schemas.DealCreate) -> Optional[schemas.Deal]:
    """Updates an existing deal with fresh data from the pipeline."""
    update_data = deal_update.dict(exclude_unset=True)

    await get_deals_collection(db).update_one(
        {"_id": existing_deal.id}, {"$set": update_data}
    )

    updated_deal = await get_deals_collection(db).find_one({"_id": existing_deal.id})
    if updated_deal:
        return schemas.Deal(**updated_deal)
    return None

async def search_deals(db: motor.motor_asyncio.AsyncIOMotorDatabase, query: str) -> List[schemas.Deal]:
    """Searches for deals by title using a case-insensitive regex."""
    # For better performance in production, a text index should be created on the title field.
    deals_cursor = get_deals_collection(db).find({"title": {"$regex": query, "$options": "i"}})
    deals = await deals_cursor.to_list(length=100)
    return [schemas.Deal(**deal) for deal in deals]

async def get_categories(db: motor.motor_asyncio.AsyncIOMotorDatabase) -> List[schemas.Category]:
    """Gets a list of categories and their counts using the aggregation framework."""
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    categories_cursor = get_deals_collection(db).aggregate(pipeline)
    categories = await categories_cursor.to_list(length=None)
    return [schemas.Category(**cat) for cat in categories]

async def increment_click(db: motor.motor_asyncio.AsyncIOMotorDatabase, deal_id: str) -> Optional[schemas.Deal]:
    """Increments the click count for a deal."""
    if not ObjectId.is_valid(deal_id):
        return None

    result = await get_deals_collection(db).find_one_and_update(
        {"_id": ObjectId(deal_id)},
        {"$inc": {"clicks": 1}},
        return_document=motor.motor_asyncio.core.pymongo.ReturnDocument.AFTER
    )
    if result:
        return schemas.Deal(**result)
    return None
