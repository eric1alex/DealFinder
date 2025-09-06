import random

# --- Mock Affiliate Tags ---
AMAZON_AFFILIATE_TAG = "yourtag-21"
FLIPKART_AFFILIATE_ID = "youraffid"

# --- Mock API Functions ---

def fetch_amazon_product_details(asin: str):
    """
    Mocks a call to the Amazon Product Advertising API.
    Returns a dictionary with product details.
    """
    # In a real implementation, this would involve making an API call.
    # Here, we'll just return some plausible-looking fake data.
    original_price = round(random.uniform(1000, 5000), 2)
    discount_percent = round(random.uniform(0.1, 0.5), 2)

    return {
        "title": f"Mock Amazon Product - {asin}",
        "price": round(original_price * (1 - discount_percent), 2),
        "original_price": original_price,
        "discount": round(discount_percent * 100, 2),
        "images": [f"https://m.media-amazon.com/images/I/image{i}.jpg" for i in range(1, 4)],
        "availability": True,
        "asin": asin
    }

def fetch_flipkart_product_details(pid: str):
    """
    Mocks a call to the Flipkart Affiliate API.
    Returns a dictionary with product details.
    """
    original_price = round(random.uniform(1000, 5000), 2)
    discount_percent = round(random.uniform(0.1, 0.5), 2)

    return {
        "title": f"Mock Flipkart Product - {pid}",
        "price": round(original_price * (1 - discount_percent), 2),
        "original_price": original_price,
        "discount": round(discount_percent * 100, 2),
        "images": [f"https://rukminim1.flixcart.com/image/image{i}.jpeg" for i in range(1, 4)],
        "availability": True, # Flipkart API has more complex availability info
        "pid": pid
    }

def rewrite_affiliate_link(url: str, source: str):
    """
    Rewrites a URL to include an affiliate tag.
    """
    if source == "amazon":
        # Check if the URL already has a query string
        if '?' in url:
            return f"{url}&tag={AMAZON_AFFILIATE_TAG}"
        else:
            return f"{url}?tag={AMAZON_AFFILIATE_TAG}"
    elif source == "flipkart":
        # Flipkart affiliate links are usually rewritten completely
        # For simplicity, we'll just append an affiliate ID
        if '?' in url:
            return f"{url}&affid={FLIPKART_AFFILIATE_ID}"
        else:
            return f"{url}?affid={FLIPKART_AFFILIATE_ID}"
    return url

# --- Main Enrichment Function ---

def enrich_deal(deal):
    """
    Takes a raw deal (from Reddit) and enriches it with API data.
    """
    source = deal.get("source")
    product_id = deal.get("product_id")

    if not source or not product_id:
        return None

    details = None
    if source == "amazon":
        details = fetch_amazon_product_details(product_id)
    elif source == "flipkart":
        details = fetch_flipkart_product_details(product_id)

    if not details:
        return None

    # Combine the data
    enriched_deal = {
        "product_id": product_id,
        "title": details.get("title"),
        "image": details.get("images")[0] if details.get("images") else None,
        "price": details.get("price"),
        "original_price": details.get("original_price"),
        "discount": details.get("discount"),
        "url": rewrite_affiliate_link(deal["url"], source),
        "source": source,
        "category": "electronics", # Mock category
        "reddit_post_id": deal.get("reddit_post_id"),
    }

    return enriched_deal


if __name__ == '__main__':
    # Example usage
    raw_deal_amazon = {
        "url": "https://www.amazon.in/dp/B08C4V3228",
        "source": "amazon",
        "product_id": "B08C4V3228",
        "reddit_post_id": "t3_12345"
    }

    raw_deal_flipkart = {
        "url": "https://www.flipkart.com/p/item?pid=MOBFCT563Y4M2ZJ9",
        "source": "flipkart",
        "product_id": "MOBFCT563Y4M2ZJ9",
        "reddit_post_id": "t3_67890"
    }

    enriched_amazon = enrich_deal(raw_deal_amazon)
    print("Enriched Amazon Deal:")
    print(enriched_amazon)

    enriched_flipkart = enrich_deal(raw_deal_flipkart)
    print("\nEnriched Flipkart Deal:")
    print(enriched_flipkart)
