"""
Batch Search Example

This example demonstrates how to search for multiple queries in a single request,
which is more efficient than making multiple sequential calls.
"""

import asyncio
import os
import httpx


async def batch_search(queries: list[str], api_key: str) -> dict:
    """
    Perform batch search for multiple queries.
    
    Args:
        queries: List of search queries
        api_key: Your Ad-Tokens API key
        
    Returns:
        Dictionary containing batch search results
    """
    async with httpx.AsyncClient() as client:
        try:
            # Prepare batch request
            batch_request = {
                "queries": [
                    {"query": query, "limit": 3}
                    for query in queries
                ]
            }
            
            response = await client.post(
                "https://api.ad-tokens.com/search/batch",
                headers={
                    "x-api-key": api_key,
                    "Content-Type": "application/json",
                },
                json=batch_request,
                timeout=30.0,
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


async def main():
    api_key = os.getenv("AD_TOKENS_API_KEY", "your-api-key-here")
    
    if api_key == "your-api-key-here":
        print("⚠️  Please set AD_TOKENS_API_KEY environment variable")
        return
    
    # Multiple queries to search
    queries = [
        "wireless headphones",
        "mechanical keyboard",
        "gaming mouse",
    ]
    
    print(f"🔍 Batch searching for {len(queries)} queries...\n")
    
    try:
        result = await batch_search(queries, api_key)
        
        # Display results for each query
        for i, search_result in enumerate(result["results"], 1):
            query = queries[i - 1]
            print(f"📦 Query {i}: {query}")
            print(f"   Found {len(search_result['results'])} products\n")
            
            for j, product in enumerate(search_result["results"], 1):
                print(f"   {j}. {product['title']}")
                print(f"      Price: {product['price']}")
                print(f"      Relevance: {product['relevance_score']:.2%}")
            
            print()
        
        # Display batch metadata
        metadata = result.get("metadata", {})
        if "total_queries" in metadata:
            print(f"✅ Processed {metadata['total_queries']} queries")
        if "total_time_ms" in metadata:
            print(f"⏱️  Total time: {metadata['total_time_ms']:.2f}ms")
            
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())

