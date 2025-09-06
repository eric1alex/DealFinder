from sqlalchemy.orm import Session
from . import schemas
import random
import datetime
from typing import List, Optional

# --- Mock Database ---

# This will be our mock 'deals' table
MOCK_DB_DEALS: List[schemas.Deal] = []
# This will be our mock sequence for IDs
MOCK_DB_ID_SEQ = 0

# A simple class to mimic the SQLAlchemy Deal model object
class MockDealModel:
    def __init__(self, **kwargs):
        global MOCK_DB_ID_SEQ
        MOCK_DB_ID_SEQ += 1
        self.id = MOCK_DB_ID_SEQ
        self.created_at = datetime.datetime.utcnow()
        self.clicks = 0

        for k, v in kwargs.items():
            setattr(self, k, v)

# --- CRUD Functions ---

def get_deal(db: Session, deal_id: int) -> Optional[MockDealModel]:
    """Gets a single deal by ID from the mock DB."""
    for deal in MOCK_DB_DEALS:
        if deal.id == deal_id:
            return deal
    return None

def get_deals(db: Session, skip: int = 0, limit: int = 10, filter_by_category: Optional[str] = None, sort_by: Optional[str] = None) -> List[MockDealModel]:
    """Gets a list of deals from the mock DB with filtering and sorting."""
    deals = list(MOCK_DB_DEALS) # Make a copy

    if filter_by_category:
        deals = [d for d in deals if d.category == filter_by_category]

    if sort_by:
        # Sort price ascending, everything else (discount, clicks) descending
        reverse = True
        if sort_by == 'price':
            reverse = False

        deals = sorted(deals, key=lambda d: getattr(d, sort_by, 0), reverse=reverse)

    return deals[skip:limit]

def get_deal_by_product_id(db: Session, product_id: str, source: str) -> Optional[MockDealModel]:
    """Finds a deal by its product ID and source."""
    for deal in MOCK_DB_DEALS:
        if deal.product_id == product_id and deal.source == source:
            return deal
    return None

def create_deal(db: Session, deal: schemas.DealCreate) -> MockDealModel:
    """Creates a new deal in the mock DB."""
    db_deal = MockDealModel(**deal.dict())
    MOCK_DB_DEALS.append(db_deal)
    return db_deal

def update_deal(db: Session, db_deal: MockDealModel, deal_update: schemas.DealCreate) -> MockDealModel:
    """Updates an existing deal in the mock DB."""
    for key, value in deal_update.dict().items():
        setattr(db_deal, key, value)
    # In a real scenario, you might want to update the 'created_at' or add an 'updated_at' field.
    # For now, we'll just update the fields.
    return db_deal

def search_deals(db: Session, query: str) -> List[MockDealModel]:
    """Searches for deals in the mock DB by title."""
    return [d for d in MOCK_DB_DEALS if query.lower() in d.title.lower()]

def get_categories(db: Session) -> List[dict]:
    """Gets a list of categories and their counts from the mock DB."""
    categories = {}
    for deal in MOCK_DB_DEALS:
        cat = deal.category
        categories[cat] = categories.get(cat, 0) + 1
    return [{"category": k, "count": v} for k, v in categories.items()]

def increment_click(db: Session, deal_id: int) -> Optional[MockDealModel]:
    """Increments the click count for a deal."""
    db_deal = get_deal(db, deal_id)
    if db_deal:
        db_deal.clicks += 1
    return db_deal

# --- Mock DB Population ---
def populate_mock_db():
    """Helper to pre-populate the mock DB for testing."""
    if MOCK_DB_DEALS: return # Don't populate twice

    categories = ["electronics", "fashion", "home", "books"]
    sources = ["amazon", "flipkart"]

    for i in range(50):
        original_price = round(random.uniform(500, 8000), 2)
        discount = round(random.uniform(0.1, 0.7), 2)
        source = random.choice(sources)

        deal_data = {
            "product_id": f"MOCK{i}{source.upper()}",
            "title": f"Mock Product Title {i} for {source}",
            "image": f"https://example.com/image{i}.jpg",
            "price": round(original_price * (1 - discount), 2),
            "original_price": original_price,
            "discount": round(discount * 100, 2),
            "url": f"https://example.com/deal/{i}?tag=mocktag-21",
            "source": source,
            "category": random.choice(categories),
            "reddit_post_id": f"t3_mock{i}",
        }
        deal_schema = schemas.DealCreate(**deal_data)
        create_deal(None, deal_schema)

# Populate the DB when the module is loaded
populate_mock_db()
