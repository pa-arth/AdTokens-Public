"""
Feedback Submission Example

This example demonstrates how to submit relevance feedback to help improve
the recommendation engine. Feedback creates a data moat that improves
recommendations over time.
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


async def submit_feedback(
    request_id: str,
    product_id: str,
    relevant: bool,
    api_key: str,
    reason: str = None,
    user_clicked: bool = None,
) -> dict:
    """
    Submit relevance feedback for a product.
    
    Args:
        request_id: The request_id from the search response
        product_id: The product_id from the AdResponse
        relevant: Whether the product was relevant to user intent
        api_key: Your Ad-Tokens API key
        reason: Optional explanation for why it was/wasn't relevant
        user_clicked: Whether the user clicked on the product
        
    Returns:
        Dictionary containing feedback confirmation
    """
    async with httpx.AsyncClient() as client:
        try:
            payload = {
                "request_id": request_id,
                "product_id": product_id,
                "relevant": relevant,
            }
            
            if reason:
                payload["reason"] = reason
            if user_clicked is not None:
                payload["user_clicked"] = user_clicked
            
            response = await client.post(
                "https://api.ad-tokens.com/feedback",
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


async def main():
    api_key = os.getenv("AD_TOKENS_API_KEY", "your-api-key-here")
    
    if api_key == "your-api-key-here":
        print("⚠️  Please set AD_TOKENS_API_KEY environment variable")
        return
    
    # Step 1: Search for products
    query = "budget laptop for students"
    print(f"🔍 Searching for: {query}\n")
    
    try:
        search_result = await search_products(query, api_key)
        request_id = search_result["request_id"]
        
        print(f"✅ Found {len(search_result['results'])} products\n")
        
        # Display products
        for i, product in enumerate(search_result["results"], 1):
            print(f"{i}. {product['title']}")
            print(f"   Price: {product['price']}")
            print(f"   Relevance: {product['relevance_score']:.2%}")
            print(f"   Product ID: {product['product_id']}\n")
        
        # Step 2: Simulate user feedback
        print("-" * 50)
        print("📝 Submitting feedback...\n")
        
        if search_result["results"]:
            first_product = search_result["results"][0]
            
            # Example: Product was relevant and user clicked
            feedback_result = await submit_feedback(
                request_id=request_id,
                product_id=first_product["product_id"],
                relevant=True,
                api_key=api_key,
                reason="Good match for budget laptop requirement",
                user_clicked=True,
            )
            
            print(f"✅ Feedback submitted successfully")
            print(f"   Feedback ID: {feedback_result.get('feedback_id')}")
            print(f"   Message: {feedback_result.get('message')}")
        
        print("\n💡 In your application:")
        print("   - Add 'Was this helpful?' buttons to product results")
        print("   - Collect feedback from users")
        print("   - Submit feedback to improve recommendations")
        print("   - This creates a data moat that improves over time")
        
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())

