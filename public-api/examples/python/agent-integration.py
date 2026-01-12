"""
AI Agent Integration Example

This example demonstrates how to integrate Ad-Tokens API with AI agents
like OpenAI GPT-4 or Anthropic Claude for contextual product recommendations.
"""

import asyncio
import os
import httpx
from typing import Optional


class AdTokensAgent:
    """Wrapper class for integrating Ad-Tokens with AI agents."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.ad-tokens.com"
        self.session_id: Optional[str] = None
    
    async def search_products(
        self,
        query: str,
        limit: int = 3,
        conversation_context: Optional[list] = None,
    ) -> dict:
        """
        Search for products with optional conversation context.
        
        Args:
            query: User query or intent
            limit: Number of results (1-10)
            conversation_context: Optional conversation history
            
        Returns:
            Search results with products
        """
        async with httpx.AsyncClient() as client:
            payload = {
                "query": query,
                "limit": limit,
            }
            
            if self.session_id:
                payload["session_id"] = self.session_id
            
            if conversation_context:
                payload["conversation_context"] = conversation_context
            
            response = await client.post(
                f"{self.base_url}/search",
                headers={
                    "x-api-key": self.api_key,
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=10.0,
            )
            response.raise_for_status()
            result = response.json()
            
            # Store session_id for future requests
            if "metadata" in result and "session_id" in result["metadata"]:
                self.session_id = result["metadata"]["session_id"]
            
            return result
    
    def format_products_for_agent(self, products: list[dict]) -> str:
        """
        Format products in a way that's easy for the agent to include in responses.
        
        Args:
            products: List of product dictionaries
            
        Returns:
            Formatted string for agent response
        """
        if not products:
            return "No products found."
        
        formatted = "Here are some product recommendations:\n\n"
        
        for i, product in enumerate(products, 1):
            formatted += f"{i}. **{product['title']}**\n"
            formatted += f"   - Price: {product['price']}\n"
            formatted += f"   - Merchant: {product['merchant']}\n"
            formatted += f"   - {product['relevance_explanation']}\n"
            formatted += f"   - [View Product]({product['url']})\n\n"
        
        if products[0].get("disclosure_text"):
            formatted += f"\n{products[0]['disclosure_text']}\n"
        
        return formatted
    
    async def track_click(self, impression_id: str):
        """Track a product click for attribution."""
        async with httpx.AsyncClient() as client:
            try:
                await client.post(
                    f"{self.base_url}/clicks/{impression_id}",
                    headers={"x-api-key": self.api_key},
                    timeout=5.0,
                )
            except Exception as e:
                print(f"Warning: Failed to track click: {e}")


async def simulate_agent_conversation():
    """
    Simulate an AI agent conversation with product recommendations.
    In a real implementation, this would integrate with OpenAI, Anthropic, etc.
    """
    api_key = os.getenv("AD_TOKENS_API_KEY", "your-api-key-here")
    
    if api_key == "your-api-key-here":
        print("⚠️  Please set AD_TOKENS_API_KEY environment variable")
        return
    
    agent = AdTokensAgent(api_key)
    
    # Simulate conversation
    conversation = [
        {"role": "user", "content": "I need a microphone"},
        {"role": "assistant", "content": "What will you be using it for?"},
        {"role": "user", "content": "Recording podcasts"},
    ]
    
    print("🤖 Agent Conversation Simulation\n")
    print("User: I need a microphone")
    print("Agent: What will you be using it for?")
    print("User: Recording podcasts\n")
    
    # Search for products with conversation context
    print("🔍 Agent searching for products...\n")
    
    try:
        result = await agent.search_products(
            query="podcast microphone",
            limit=3,
            conversation_context=conversation,
        )
        
        products = result["results"]
        formatted_products = agent.format_products_for_agent(products)
        
        print("Agent Response:")
        print("-" * 50)
        print(formatted_products)
        print("-" * 50)
        
        # Display raw product data for reference
        print("\n📦 Product Data (for agent processing):")
        for product in products:
            print(f"\n  Product ID: {product['product_id']}")
            print(f"  Impression ID: {product['impression_id']}")
            print(f"  Title: {product['title']}")
            print(f"  Relevance Score: {product['relevance_score']:.2%}")
        
        print("\n💡 Integration Tips:")
        print("   1. Use conversation_context to improve relevance")
        print("   2. Store session_id for multi-turn conversations")
        print("   3. Format products naturally in agent responses")
        print("   4. Track clicks when users click product links")
        print("   5. Never include PII in conversation context")
        
    except Exception as e:
        print(f"❌ Error: {e}")


async def openai_integration_example():
    """
    Example of how to integrate with OpenAI Function Calling.
    This is a conceptual example - you would need to install openai package.
    """
    print("\n📝 OpenAI Integration Example (Conceptual):\n")
    
    example_code = '''
# Install: pip install openai

from openai import AsyncOpenAI

client = AsyncOpenAI(api_key="your-openai-key")
ad_tokens = AdTokensAgent(api_key="your-ad-tokens-key")

# Define function for OpenAI
functions = [{
    "type": "function",
    "function": {
        "name": "search_products",
        "description": "Search for contextual product recommendations",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "User intent or product query"
                },
                "limit": {
                    "type": "integer",
                    "description": "Number of results (1-10)",
                    "default": 3
                }
            },
            "required": ["query"]
        }
    }
}]

# Use in chat completion
response = await client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "I need a microphone for podcasts"}
    ],
    tools=functions,
    tool_choice="auto"
)

# Handle function call
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    if tool_call.function.name == "search_products":
        query = json.loads(tool_call.function.arguments)["query"]
        products = await ad_tokens.search_products(query)
        formatted = ad_tokens.format_products_for_agent(products["results"])
        # Continue conversation with product recommendations
    '''
    
    print(example_code)


async def main():
    await simulate_agent_conversation()
    await openai_integration_example()


if __name__ == "__main__":
    asyncio.run(main())

