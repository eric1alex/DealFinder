# Deployment Guide for the Deal Aggregator API

This guide explains why this project cannot be hosted on GitHub Pages and provides instructions for deploying it to a suitable platform like Render.

## Why Not GitHub Pages?

GitHub Pages is a hosting service for **static websites**. This means it serves pre-built files like HTML, CSS, and JavaScript.

Our project is a **dynamic backend API** built with Python (FastAPI). It needs a server environment to run the Python code, listen for requests, and connect to a database. GitHub Pages cannot do this.

## Recommended Hosting Platforms

To run this project, you need a platform that can host a web service. Here are some popular choices with free tiers that are excellent for this kind of application:

- **Render:** A modern and easy-to-use platform for web apps, APIs, and databases.
- **Heroku:** A very popular and well-documented platform.
- **Vercel:** Can host FastAPI apps using serverless functions.
- **DigitalOcean App Platform, AWS, Google Cloud:** More powerful, "big cloud" options for larger applications.

## How to Deploy to Render (Example)

Render is a great choice for its simplicity. Here’s a step-by-step guide to get you started.

### Step 1: Create a `render.yaml` file

This file tells Render how to build and run your project. Create a new file named `render.yaml` in the root of your repository with the following content:

```yaml
services:
  - type: web
    name: deal-aggregator-api
    env: python
    plan: free
    buildCommand: "./build.sh"
    startCommand: "uvicorn deal_aggregator.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: MONGODB_URL
        # Get this from your MongoDB provider (e.g., MongoDB Atlas)
        value: "mongodb+srv://user:password@host/dbname"
      - key: MONGODB_DBNAME
        value: "deal_aggregator"
      # --- Add your Reddit API credentials here ---
      - key: REDDIT_CLIENT_ID
        value: "YOUR_REDDIT_CLIENT_ID"
      - key: REDDIT_CLIENT_SECRET
        value: "YOUR_REDDIT_CLIENT_SECRET"
      - key: REDDIT_USER_AGENT
        value: "deal-aggregator:v1 (by u/your_username)"
```

### Step 2: Create a `build.sh` file

This script tells Render the commands to run to install your dependencies. Create a new file named `build.sh` in the root of your repository with this content:

```bash
#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install -r deal_aggregator/requirements.txt
```
You will need to make this file executable. On your local machine, you would run `chmod +x build.sh` before committing it to git.

### Step 3: Deploy on Render

1.  Push your code, including the new `render.yaml` and `build.sh` files, to your GitHub repository.
2.  Go to the [Render Dashboard](https://dashboard.render.com/) and create a new "Blueprint" service.
3.  Connect the GitHub repository containing your project.
4.  Render will automatically detect the `render.yaml` file and start deploying your service.

That's it! Render will handle the rest, and your API will be live at the URL they provide.
