#!/bin/bash

# Click Tracking Example (cURL)
# 
# This script demonstrates how to track product clicks for attribution compliance.
# Click tracking is required for Skimlinks/Amazon compliance.

# Set your API key here or use environment variable
API_KEY="${AD_TOKENS_API_KEY:-your-api-key-here}"

# Check if API key is set
if [ "$API_KEY" = "your-api-key-here" ]; then
    echo "⚠️  Please set AD_TOKENS_API_KEY environment variable"
    echo "   Example: export AD_TOKENS_API_KEY='at_live_...'"
    exit 1
fi

# First, perform a search to get an impression_id
echo "🔍 Step 1: Searching for products..."
echo ""

SEARCH_RESULT=$(curl -X POST "https://api.ad-tokens.com/search" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "wireless headphones",
    "limit": 1
  }' \
  -s)

# Extract impression_id from search result
# Note: This requires jq. If not available, manually set IMPRESSION_ID
IMPRESSION_ID=$(echo "$SEARCH_RESULT" | jq -r '.results[0].impression_id // empty')

if [ -z "$IMPRESSION_ID" ] || [ "$IMPRESSION_ID" = "null" ]; then
    echo "❌ Failed to get impression_id from search result"
    echo "   Search result:"
    echo "$SEARCH_RESULT" | jq '.'
    exit 1
fi

echo "✅ Found product with impression_id: $IMPRESSION_ID"
echo ""
echo "👆 Step 2: Tracking click..."
echo ""

# Track the click
curl -X POST "https://api.ad-tokens.com/clicks/$IMPRESSION_ID" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.'

echo ""
echo "💡 In your application:"
echo "   1. Display products from search results"
echo "   2. When user clicks a product link, call this endpoint"
echo "   3. Then redirect user to product URL"
echo "   4. This ensures compliance with Skimlinks/Amazon requirements"

# Note: This script requires jq for JSON parsing
# Install with: brew install jq (macOS) or apt-get install jq (Linux)

