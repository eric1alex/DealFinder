import praw
import re
import os

# --- Constants ---
# It's better to use environment variables for credentials for security.
REDDIT_CLIENT_ID = os.environ.get("REDDIT_CLIENT_ID", "your_client_id")
REDDIT_CLIENT_SECRET = os.environ.get("REDDIT_CLIENT_SECRET", "your_client_secret")
REDDIT_USER_AGENT = os.environ.get("REDDIT_USER_AGENT", "your_user_agent")

AMAZON_REGEX = r"https?://(?:www\.)?amazon\.in/.*?/dp/([A-Z0-9]{10})"
FLIPKART_REGEX = r"https?://(?:www\.)?flipkart\.com/.*?/p/.*?pid=([A-Z0-9]+)"

# --- PRAW Client Initialization ---
def get_reddit_client():
    """Initializes and returns a PRAW Reddit client instance."""
    # This will raise an exception if credentials are not set, which is fine
    # as the app shouldn't run without them. A more robust implementation
    # might handle this more gracefully.
    if REDDIT_CLIENT_ID == "your_client_id":
        # This will prevent the app from running with default placeholder values
        # In a real scenario, we'd log an error and exit.
        # For this implementation, we'll return None to avoid crashing.
        print("Warning: Reddit API credentials are not set. Reddit ingestion will be skipped.")
        return None

    return praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent=REDDIT_USER_AGENT,
    )

# --- Deal Extraction Logic ---
def find_links_in_text(text):
    """Finds Amazon and Flipkart links in a given string."""
    amazon_links = re.findall(AMAZON_REGEX, text)
    flipkart_links = re.findall(FLIPKART_REGEX, text)
    return amazon_links, flipkart_links

def fetch_deals_from_reddit(subreddit_name: str = "dealsforindia", limit: int = 25):
    """
    Fetches deals from a specified subreddit.

    Args:
        subreddit_name: The name of the subreddit to fetch from.
        limit: The number of posts to fetch.

    Returns:
        A list of deal dictionaries.
    """
    reddit = get_reddit_client()
    if not reddit:
        return []

    deals = []
    subreddit = reddit.subreddit(subreddit_name)

    for post in subreddit.hot(limit=limit):
        # Check post title and selftext
        text_to_search = post.title + " " + post.selftext
        amazon_asins, flipkart_pids = find_links_in_text(text_to_search)

        for asin in amazon_asins:
            deals.append({
                "url": f"https://www.amazon.in/dp/{asin}",
                "source": "amazon",
                "product_id": asin,
                "reddit_post_id": post.id
            })

        for pid in flipkart_pids:
            # This is a simplified URL, the actual URL might be different
            deals.append({
                "url": f"https://www.flipkart.com/p/item?pid={pid}",
                "source": "flipkart",
                "product_id": pid,
                "reddit_post_id": post.id
            })

        # Check comments
        post.comments.replace_more(limit=0) # remove "more comments" links
        for comment in post.comments.list():
            amazon_asins, flipkart_pids = find_links_in_text(comment.body)
            for asin in amazon_asins:
                 deals.append({
                    "url": f"https://www.amazon.in/dp/{asin}",
                    "source": "amazon",
                    "product_id": asin,
                    "reddit_post_id": post.id
                })
            for pid in flipkart_pids:
                deals.append({
                    "url": f"httpshttps://www.flipkart.com/p/item?pid={pid}",
                    "source": "flipkart",
                    "product_id": pid,
                    "reddit_post_id": post.id
                })

    return deals

if __name__ == '__main__':
    # Example of how to use the function
    # To run this, you would need to set the environment variables:
    # export REDDIT_CLIENT_ID="your_id"
    # export REDDIT_CLIENT_SECRET="your_secret"
    # export REDDIT_USER_AGENT="your_user_agent"

    retrieved_deals = fetch_deals_from_reddit()
    if retrieved_deals:
        print(f"Found {len(retrieved_deals)} deals:")
        for deal in retrieved_deals:
            print(deal)
    else:
        print("No deals found or Reddit API credentials not configured.")
