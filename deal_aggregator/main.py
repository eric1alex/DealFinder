from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional

from . import crud, schemas, database, product_api_client, reddit_client

# This would create the tables in a real DB
# database.create_tables()

# In a real app, you'd get the session from a dependency
# For now, our CRUD functions don't use the db session, so we can pass None.
def get_db():
    # This is where you would yield a session from database.SessionLocal
    yield None

app = FastAPI(
    title="Deal Aggregator API",
    description="An API for finding deals from various sources.",
    version="1.0.0"
)

# --- Background Task for Data Pipeline ---
def run_data_pipeline(db: Session):
    """
    The main data pipeline function to be run in the background.
    1. Fetches raw deals from Reddit.
    2. Enriches them with product data.
    3. Saves them to the database, handling duplicates.
    """
    print("Starting data pipeline...")
    raw_deals = reddit_client.fetch_deals_from_reddit()
    if not raw_deals:
        print("No new deals found on Reddit.")
        return

    count_created = 0
    count_updated = 0
    for raw_deal in raw_deals:
        enriched_data = product_api_client.enrich_deal(raw_deal)
        if not enriched_data:
            continue

        deal_in = schemas.DealCreate(**enriched_data)

        # Deduplication logic
        existing_deal = crud.get_deal_by_product_id(db, product_id=deal_in.product_id, source=deal_in.source)

        if existing_deal:
            crud.update_deal(db, db_deal=existing_deal, deal_update=deal_in)
            count_updated += 1
        else:
            crud.create_deal(db, deal=deal_in)
            count_created += 1

    print(f"Data pipeline finished. Created: {count_created}, Updated: {count_updated}")


@app.post("/pipeline/run", status_code=202)
def trigger_pipeline(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Triggers the data ingestion and enrichment pipeline to run in the background.
    """
    background_tasks.add_task(run_data_pipeline, db)
    return {"message": "Data pipeline has been triggered and is running in the background."}


# --- API Endpoints for Frontend ---

@app.get("/deals", response_model=List[schemas.Deal])
def get_all_deals(
    filter: Optional[str] = None,
    sort: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Get a list of deals.
    - **filter**: Filter by category (e.g., 'electronics').
    - **sort**: Sort by a field (e.g., 'discount', 'price').
    """
    deals = crud.get_deals(db, skip=skip, limit=limit, filter_by_category=filter, sort_by=sort)
    return deals

@app.get("/deal/{deal_id}", response_model=schemas.Deal)
def get_single_deal(deal_id: int, db: Session = Depends(get_db)):
    """
    Get full details for a single product.
    """
    db_deal = crud.get_deal(db, deal_id=deal_id)
    if db_deal is None:
        raise HTTPException(status_code=404, detail="Deal not found")
    return db_deal

@app.post("/deal/{deal_id}/click", response_model=schemas.Deal)
def record_deal_click(deal_id: int, db: Session = Depends(get_db)):
    """
    Records a click on a deal and returns the updated deal.
    """
    db_deal = crud.increment_click(db, deal_id=deal_id)
    if db_deal is None:
        raise HTTPException(status_code=404, detail="Deal not found")
    return db_deal

@app.get("/search", response_model=List[schemas.Deal])
def search_for_deals(q: str, db: Session = Depends(get_db)):
    """
    Search for deals by a query string (searches in the title).
    """
    deals = crud.search_deals(db, query=q)
    return deals

@app.get("/categories", response_model=List[schemas.Category])
def get_all_categories(db: Session = Depends(get_db)):
    """
    Get a list of all categories and the number of deals in each.
    """
    return crud.get_categories(db)
