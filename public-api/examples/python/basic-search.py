"""
Basic Product Search Example

This example demonstrates how to perform a simple product search using the Ad-Tokens API.
"""

import asyncio
import os
import httpx


async def search_products(query: str, api_key: str) -> dict:
    """
    Search for products using the Ad-Tokens API.
    
    Args:
        query: The search query (user intent)
        api_key: Your Ad-Tokens API key
        
    Returns:
        Dictionary containing search results
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.ad-tokens.com/search",
                headers={
                    "x-api-key": api_key,
                    "Content-Type": "application/json",
                },
                json={
                    "query": query,
                    "limit": 3,
                },
                timeout=10.0,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {e.response.status_code}")
            print(f"Error: {e.response.text}")
            raise
        except httpx.RequestError as e:
            print(f"Request error occurred: {e}")
            raise


async def main():
    # Get API key from environment variable
    api_key = os.getenv("AD_TOKENS_API_KEY", "your-api-key-here")
    
    if api_key == "your-api-key-here":
        print("⚠️  Please set AD_TOKENS_API_KEY environment variable")
        print("   Example: export AD_TOKENS_API_KEY='at_live_...'")
        return
    
    # Perform search
    query = "wireless headphones for running"
    print(f"🔍 Searching for: {query}\n")
    
    try:
        result = await search_products(query, api_key)
        
        # Display results
        print(f"✅ Found {len(result['results'])} products\n")
        print(f"Request ID: {result['request_id']}\n")
        
        for i, product in enumerate(result["results"], 1):
            print(f"{i}. {product['title']}")
            print(f"   Price: {product['price']}")
            print(f"   Merchant: {product['merchant']}")
            print(f"   Relevance: {product['relevance_score']:.2%}")
            print(f"   Explanation: {product['relevance_explanation']}")
            print(f"   URL: {product['url']}")
            print(f"   Impression ID: {product['impression_id']}")
            print()
        
        # Display metadata
        metadata = result.get("metadata", {})
        if "total_matches" in metadata:
            print(f"Total matches: {metadata['total_matches']}")
        if "session_id" in metadata:
            print(f"Session ID: {metadata['session_id']}")
            
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())

