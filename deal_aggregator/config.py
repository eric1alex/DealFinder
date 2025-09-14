from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # MongoDB Settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DBNAME: str = "deal_aggregator"

    # Reddit API Credentials
    REDDIT_CLIENT_ID: str = "your_client_id"
    REDDIT_CLIENT_SECRET: str = "your_client_secret"
    REDDIT_USER_AGENT: str = "your_user_agent"

    # Affiliate API Settings
    AMAZON_AFFILIATE_TAG: str = "yourtag-21"
    FLIPKART_AFFILIATE_ID: str = "youraffid"

    class Config:
        # This tells pydantic to load the variables from a .env file
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
