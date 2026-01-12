#!/bin/bash

# Batch Search Example (cURL)
# 
# This script demonstrates how to search for multiple queries
# in a single request using the Ad-Tokens API.

# Set your API key here or use environment variable
API_KEY="${AD_TOKENS_API_KEY:-your-api-key-here}"

# Check if API key is set
if [ "$API_KEY" = "your-api-key-here" ]; then
    echo "⚠️  Please set AD_TOKENS_API_KEY environment variable"
    echo "   Example: export AD_TOKENS_API_KEY='at_live_...'"
    exit 1
fi

echo "🔍 Batch searching for multiple queries..."
echo ""

# Perform batch search
curl -X POST "https://api.ad-tokens.com/search/batch" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {
        "query": "wireless headphones",
        "limit": 3
      },
      {
        "query": "mechanical keyboard",
        "limit": 2
      },
      {
        "query": "gaming mouse",
        "limit": 2
      }
    ]
  }' \
  -w "\n\nHTTP Status: %{http_code}\nTotal Time: %{time_total}s\n" \
  -s | jq '.'

# Note: This script requires jq for JSON formatting
# Install with: brew install jq (macOS) or apt-get install jq (Linux)

