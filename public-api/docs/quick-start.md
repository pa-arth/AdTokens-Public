# Quick Start Guide

Get up and running with Ad-Tokens API in 5 minutes.

## Prerequisites

- An account at [https://www.ad-tokens.com](https://www.ad-tokens.com)
- An API key (create one in the dashboard)
- Basic knowledge of HTTP requests

## Step 1: Get Your API Key

1. Sign up at [https://www.ad-tokens.com](https://www.ad-tokens.com)
2. Navigate to the API Keys section in the dashboard
3. Click "Create API Key"
4. Give it a name (e.g., "My Bot")
5. Copy the API key (you'll only see it once!)

## Step 2: Make Your First Request

### Using cURL

```bash
curl -X POST https://api.ad-tokens.com/search \
  -H "x-api-key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "wireless headphones for running",
    "limit": 3
  }'
```

### Using Python

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
            "query": "wireless headphones for running",
            "limit": 3
        }
    )
    data = response.json()
    print(data)
```

### Using JavaScript

```javascript
const response = await fetch('https://api.ad-tokens.com/search', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key-here',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'wireless headphones for running',
    limit: 3
  })
});

const data = await response.json();
console.log(data);
```

## Step 3: Understand the Response

The API returns a JSON response with the following structure:

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
      "relevance_explanation": "Matched because you mentioned 'wireless headphones' and this is a top-rated model with excellent sound quality.",
      "currency": "USD",
      "image_url": "https://images.amazon.com/products/12345.jpg"
    }
  ],
  "metadata": {
    "total_matches": 15,
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "model_version": "text-embedding-3-small-v1"
  }
}
```

## Step 4: Track Clicks (Required for Compliance)

When a user clicks on a product, you must track it for Skimlinks/Amazon compliance:

```bash
curl -X POST https://api.ad-tokens.com/clicks/{impression_id} \
  -H "x-api-key: your-api-key-here" \
  -H "Content-Type: application/json"
```

Replace `{impression_id}` with the `impression_id` from the product in the search results.

## Next Steps

- Read the [Search Guide](search-guide.md) for advanced search features
- Check out [Code Examples](../examples/) for integration patterns
- Review [Best Practices](best-practices.md) for production deployments
- See [Authentication Guide](authentication.md) for security best practices

## Common Issues

### 401 Unauthorized
- Check that your API key is correct
- Ensure you're using the `x-api-key` header (not `Authorization`)

### 429 Rate Limit Exceeded
- You've hit your rate limit. Check the `X-RateLimit-Reset` header for when it resets
- Consider upgrading your plan for higher limits

### 400 Bad Request
- Check that your request body is valid JSON
- Ensure the `query` field is present and not empty
- Verify that `limit` is between 1 and 10

## Need Help?

- Check the [FAQ](faq.md) for common questions
- Visit [https://docs.ad-tokens.com](https://docs.ad-tokens.com) for full documentation
- Email support: hello@ad-tokens.com

