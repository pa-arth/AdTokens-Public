"""
Click Tracking Example

This example demonstrates how to track product clicks for attribution compliance.
Click tracking is required for Skimlinks/Amazon compliance.
"""

import asyncio
import os
import httpx


async def search_products(query: str, api_key: str) -> dict:
    """Search for products."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.ad-tokens.com/search",
            headers={
                "x-api-key": api_key,
                "Content-Type": "application/json",
            },
            json={"query": query, "limit": 3},
        )
        response.raise_for_status()
        return response.json()


async def track_click(impression_id: str, api_key: str, request_id: str = None) -> dict:
    """
    Track a product click for attribution compliance.
    
    Args:
        impression_id: The impression_id from the product result
        api_key: Your Ad-Tokens API key
        request_id: Optional request_id from the original search
        
    Returns:
        Dictionary containing click tracking confirmation
    """
    async with httpx.AsyncClient() as client:
        try:
            payload = {}
            if request_id:
                payload["request_id"] = request_id
            
            response = await client.post(
                f"https://api.ad-tokens.com/clicks/{impression_id}",
                headers={
                    "x-api-key": api_key,
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=10.0,
            )
            response.raise_for_status()
            return response.json()
            
        except httpx.HTTPStatusError as e:
            print(f"❌ HTTP error: {e.response.status_code}")
            print(f"   Error: {e.response.text}")
            raise
        except httpx.RequestError as e:
            print(f"❌ Request error: {e}")
            raise


async def simulate_user_click(product: dict, request_id: str, api_key: str):
    """
    Simulate a user clicking on a product.
    In a real application, this would be triggered by actual user interaction.
    """
    impression_id = product["impression_id"]
    product_title = product["title"]
    
    print(f"👆 User clicked on: {product_title}")
    print(f"   Tracking click for impression: {impression_id}")
    
    try:
        result = await track_click(impression_id, api_key, request_id)
        print(f"✅ Click tracked successfully")
        print(f"   Timestamp: {result.get('timestamp')}")
        return result
    except Exception as e:
        print(f"❌ Failed to track click: {e}")
        # In production, you might want to retry or log this
        return None


async def main():
    api_key = os.getenv("AD_TOKENS_API_KEY", "your-api-key-here")
    
    if api_key == "your-api-key-here":
        print("⚠️  Please set AD_TOKENS_API_KEY environment variable")
        return
    
    # Step 1: Search for products
    query = "wireless headphones"
    print(f"🔍 Searching for: {query}\n")
    
    try:
        search_result = await search_products(query, api_key)
        request_id = search_result["request_id"]
        
        print(f"✅ Found {len(search_result['results'])} products\n")
        print(f"Request ID: {request_id}\n")
        
        # Display products
        for i, product in enumerate(search_result["results"], 1):
            print(f"{i}. {product['title']}")
            print(f"   Price: {product['price']}")
            print(f"   URL: {product['url']}")
            print(f"   Impression ID: {product['impression_id']}\n")
        
        # Step 2: Simulate user clicking on the first product
        print("-" * 50)
        if search_result["results"]:
            first_product = search_result["results"][0]
            await simulate_user_click(first_product, request_id, api_key)
        
        print("\n💡 In your application:")
        print("   1. Display products from search results")
        print("   2. When user clicks a product link, call track_click()")
        print("   3. Then redirect user to product URL")
        print("   4. This ensures compliance with Skimlinks/Amazon requirements")
        
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())

