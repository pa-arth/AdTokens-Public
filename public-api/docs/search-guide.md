# Search API Guide

Complete reference for the Ad-Tokens search API, including filters, streaming, and advanced features.

## Basic Search

The simplest search requires only a query:

```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(
        "https://api.ad-tokens.com/search",
        headers={
            "x-api-key": "your-api-key-here",
            "Content-Type": "application/json",
        },
        json={
            "query": "wireless headphones for running"
        }
    )
    data = response.json()
```

## Request Parameters

### Required Parameters

- `query` (string): The natural language context or user query. **Do not include PII** (names, emails, phone numbers).

### Optional Parameters

- `limit` (integer, default: 3, max: 10): Maximum number of results to return
- `stream` (boolean, default: false): Enable Server-Sent Events streaming
- `filters` (object): Filter results by price, merchant, brand, category
- `sort` (string): Sort order - `relevance` (default), `price_asc`, `price_desc`
- `min_relevance_score` (float, default: 0.5): Minimum relevance threshold (0.0-1.0)
- `session_id` (string, UUID): Conversation session identifier
- `conversation_context` (array): Conversation history for context-aware matching
- `exclude_product_ids` (array): Product IDs to exclude from results
- `experiment_id` (string): A/B testing experiment identifier
- `metadata` (object): Custom key-value pairs for internal tracking

## Filters

Filter results to match specific criteria:

```python
response = await client.post(
    "https://api.ad-tokens.com/search",
    headers={"x-api-key": "your-api-key-here"},
    json={
        "query": "laptop",
        "filters": {
            "min_price": 500.0,
            "max_price": 2000.0,
            "merchant": "Amazon",
            "brand": "Apple",
            "category": "Electronics",
            "keyword_filter": "MacBook"
        }
    }
)
```

### Available Filters

- `min_price` (float): Minimum price in USD
- `max_price` (float): Maximum price in USD
- `merchant` (string): Filter by merchant name (e.g., "Amazon", "Best Buy")
- `brand` (string): Filter by brand name (e.g., "Sony", "Apple")
- `category` (string): Filter by product category
- `keyword_filter` (string): Strict keyword filter for hybrid search

## Sorting

Control how results are sorted:

```python
# Sort by relevance (default)
json={"query": "laptop", "sort": "relevance"}

# Sort by price (low to high)
json={"query": "laptop", "sort": "price_asc"}

# Sort by price (high to low)
json={"query": "laptop", "sort": "price_desc"}
```

## Streaming (Server-Sent Events)

Enable real-time streaming for better UX:

```python
import httpx
import json

async with httpx.AsyncClient() as client:
    async with client.stream(
        "POST",
        "https://api.ad-tokens.com/search",
        headers={
            "x-api-key": "your-api-key-here",
            "Content-Type": "application/json",
        },
        json={
            "query": "wireless headphones",
            "stream": True
        }
    ) as response:
        async for line in response.aiter_lines():
            if line.startswith("data: "):
                data = json.loads(line[6:])
                print(f"Received: {data}")
```

### JavaScript Streaming

```javascript
const response = await fetch('https://api.ad-tokens.com/search', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key-here',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'wireless headphones',
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      console.log('Received:', data);
    }
  }
}
```

## Conversation Context

Provide conversation history for better context-aware matching:

```python
response = await client.post(
    "https://api.ad-tokens.com/search",
    headers={"x-api-key": "your-api-key-here"},
    json={
        "query": "something cheaper",
        "session_id": "550e8400-e29b-41d4-a716-446655440000",
        "conversation_context": [
            {"role": "user", "content": "I need a microphone"},
            {"role": "assistant", "content": "What will you use it for?"},
            {"role": "user", "content": "Recording podcasts"}
        ]
    }
)
```

**Important**: Do not include PII in conversation context. Only include intent, preferences, and product-related context.

## Batch Search

Search for multiple queries in a single request:

```python
response = await client.post(
    "https://api.ad-tokens.com/search/batch",
    headers={"x-api-key": "your-api-key-here"},
    json={
        "queries": [
            {"query": "laptop", "limit": 3},
            {"query": "wireless mouse", "limit": 2},
            {"query": "mechanical keyboard", "limit": 2}
        ]
    }
)
```

## Similar Products

Find products similar to a given product:

```python
response = await client.get(
    f"https://api.ad-tokens.com/products/{product_id}/similar",
    headers={"x-api-key": "your-api-key-here"},
    params={"limit": 5}
)
```

## Response Structure

```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "results": [
    {
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "impression_id": "789e0123-e45b-67c8-d901-234567890abc",
      "title": "Sony WH-1000XM5 Noise Canceling Headphones",
      "description": "Top-tier noise cancellation and 30-hour battery life.",
      "url": "https://ad-tokens.com/p/12345",
      "price": "$348.00",
      "merchant": "Amazon",
      "brand": "Sony",
      "relevance_score": 0.98,
      "relevance_explanation": "Matched because you mentioned 'wireless headphones'...",
      "currency": "USD",
      "last_updated_at": "2024-01-15T10:30:00Z",
      "image_url": "https://images.amazon.com/products/12345.jpg",
      "disclosure_text": "As an Amazon Associate, we earn from qualifying purchases."
    }
  ],
  "metadata": {
    "total_matches": 15,
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "model_version": "text-embedding-3-small-v1"
  }
}
```

## Response Headers

Important headers in the response:

- `X-RateLimit-Limit`: Total requests allowed per window
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `X-Search-Time`: Total search time in milliseconds
- `X-Embedding-Time`: Embedding generation time in milliseconds
- `X-Cache-Hit`: Whether result was served from cache ("true" or "false")

## Error Handling

### 400 Bad Request

```json
{
  "code": "INVALID_INPUT",
  "message": "The 'query' field is required and cannot be empty."
}
```

### 429 Rate Limit Exceeded

```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Please try again later."
}
```

Check `X-RateLimit-Reset` header for when the limit resets.

### 503 Service Unavailable

```json
{
  "code": "SERVICE_UNAVAILABLE",
  "message": "The service is temporarily unavailable. Please try again later."
}
```

## Best Practices

1. **Use session_id for conversation context**
   - Maintains context across multiple searches
   - Improves relevance over time

2. **Set appropriate limits**
   - Default of 3 is usually sufficient
   - Higher limits increase latency

3. **Handle errors gracefully**
   - Implement retry logic with exponential backoff
   - Show user-friendly error messages

4. **Track clicks for compliance**
   - Always call `/clicks/{impression_id}` when user clicks
   - Required for Skimlinks/Amazon compliance

5. **Use streaming for better UX**
   - Shows results as they arrive
   - Reduces perceived latency

## Next Steps

- Check out [Code Examples](../examples/) for complete integration patterns
- Read [Best Practices](best-practices.md) for production deployments
- Review [Analytics Guide](analytics.md) for tracking performance

