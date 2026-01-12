#!/bin/bash

# Basic Product Search Example (cURL)
# 
# This script demonstrates how to perform a simple product search
# using the Ad-Tokens API with cURL.

# Set your API key here or use environment variable
API_KEY="${AD_TOKENS_API_KEY:-your-api-key-here}"

# Check if API key is set
if [ "$API_KEY" = "your-api-key-here" ]; then
    echo "⚠️  Please set AD_TOKENS_API_KEY environment variable"
    echo "   Example: export AD_TOKENS_API_KEY='at_live_...'"
    exit 1
fi

# Search query
QUERY="wireless headphones for running"

echo "🔍 Searching for: $QUERY"
echo ""

# Perform search
curl -X POST "https://api.ad-tokens.com/search" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"$QUERY\",
    \"limit\": 3
  }" \
  -w "\n\nHTTP Status: %{http_code}\nTotal Time: %{time_total}s\n" \
  -s | jq '.'

# Note: This script requires jq for JSON formatting
# Install with: brew install jq (macOS) or apt-get install jq (Linux)
# If jq is not available, remove the pipe to jq

