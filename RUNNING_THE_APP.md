# How to Run the Deal Aggregator API

This guide provides the step-by-step instructions to get the application running on your local machine.

### Step 1: Install Dependencies

First, make sure you have all the necessary Python packages installed. From the main project directory, run:

```bash
pip install -r deal_aggregator/requirements.txt
```

### Step 2: Create Your Secrets File (`.env`)

This is the most important step. The application loads all your secret credentials from a `.env` file.

1.  Create a new file named `.env` in the main project directory (the same directory that contains `.gitignore` and the `deal_aggregator` folder).

2.  Copy the template below into that `.env` file. Fill in your own MongoDB, Amazon, and Flipkart details. The Reddit credentials you provided have been pre-filled.

```env
# Your MongoDB connection URL (e.g., from a service like MongoDB Atlas)
MONGODB_URL="mongodb+srv://user:password@host/your_db_name"
MONGODB_DBNAME="deal_aggregator"

# Your Reddit API Credentials
REDDIT_CLIENT_ID="AXqUvlqe4jUtHDwZ0ltGng"
REDDIT_CLIENT_SECRET="whmVX9g3n45SaIXWNqMx2QnMCBpHUA"
REDDIT_USER_AGENT="my_reddit_app:1.0 (by u/PictureUnited2573)"

# Your Affiliate Tags
AMAZON_AFFILIATE_TAG="your_amazon_tag-21"
FLIPKART_AFFILIATE_ID="your_flipkart_id"
```

### Step 3: Run the Server

Now you can start the FastAPI server. This command will also enable live reloading, which is convenient for development.

```bash
uvicorn deal_aggregator.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 4: Trigger the Data Pipeline

Once the server is running, you can trigger the data pipeline to start fetching and storing deals. Open a **new terminal window** and run:
```bash
curl -X POST http://localhost:8000/pipeline/run
```

After these steps, your API will be running locally, connected to your MongoDB database, and using your Reddit API credentials. You can then access the API endpoints we tested earlier (e.g., `http://localhost:8000/deals`).
