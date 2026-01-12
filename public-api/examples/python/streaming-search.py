"""
Streaming Search Example

This example demonstrates how to use Server-Sent Events (SSE) streaming
to receive search results in real-time.
"""

import asyncio
import json
import os
import httpx


async def stream_search(query: str, api_key: str):
    """
    Perform a streaming search using Server-Sent Events.
    
    Args:
        query: The search query
        api_key: Your Ad-Tokens API key
    """
    async with httpx.AsyncClient() as client:
        try:
            async with client.stream(
                "POST",
                "https://api.ad-tokens.com/search",
                headers={
                    "x-api-key": api_key,
                    "Content-Type": "application/json",
                },
                json={
                    "query": query,
                    "limit": 5,
                    "stream": True,  # Enable streaming
                },
                timeout=30.0,
            ) as response:
                response.raise_for_status()
                
                print(f"🔍 Streaming search for: {query}\n")
                print("📡 Waiting for results...\n")
                
                buffer = ""
                products_received = 0
                
                async for chunk in response.aiter_text():
                    buffer += chunk
                    
                    # Process complete lines
                    while "\n" in buffer:
                        line, buffer = buffer.split("\n", 1)
                        line = line.strip()
                        
                        if not line:
                            continue
                        
                        # SSE format: "event: result\ndata: {...}\n\n"
                        if line.startswith("event: "):
                            event_type = line[7:]
                            continue
                        
                        if line.startswith("data: "):
                            try:
                                data = json.loads(line[6:])
                                
                                # Handle different event types
                                if "results" in data:
                                    for product in data["results"]:
                                        products_received += 1
                                        print(f"✅ Product {products_received}: {product['title']}")
                                        print(f"   Price: {product['price']}")
                                        print(f"   Relevance: {product['relevance_score']:.2%}\n")
                                
                                if "metadata" in data:
                                    metadata = data["metadata"]
                                    if "total_matches" in metadata:
                                        print(f"📊 Total matches: {metadata['total_matches']}")
                                        
                            except json.JSONDecodeError as e:
                                print(f"⚠️  Failed to parse JSON: {e}")
                                print(f"   Line: {line}")
                
                print(f"\n✨ Received {products_received} products via streaming")
                
        except httpx.HTTPStatusError as e:
            print(f"❌ HTTP error: {e.response.status_code}")
            print(f"   Error: {e.response.text}")
        except httpx.RequestError as e:
            print(f"❌ Request error: {e}")


async def main():
    api_key = os.getenv("AD_TOKENS_API_KEY", "your-api-key-here")
    
    if api_key == "your-api-key-here":
        print("⚠️  Please set AD_TOKENS_API_KEY environment variable")
        return
    
    query = "mechanical keyboard for programming"
    await stream_search(query, api_key)


if __name__ == "__main__":
    asyncio.run(main())

