# Best Practices

Production-ready patterns and optimizations for integrating Ad-Tokens API.

## Performance Optimization

### 1. Use Streaming for Better UX

Streaming results show products as they arrive, reducing perceived latency:

```python
async with httpx.AsyncClient() as client:
    async with client.stream(
        "POST",
        "https://api.ad-tokens.com/search",
        headers={"x-api-key": "your-api-key-here"},
        json={"query": "laptop", "stream": True}
    ) as response:
        async for line in response.aiter_lines():
            if line.startswith("data: "):
                data = json.loads(line[6:])
                # Display results immediately
                display_product(data)
```

### 2. Implement Caching

Cache search results to reduce API calls:

```python
from functools import lru_cache
import hashlib
import json

def cache_key(query: str, filters: dict) -> str:
    """Generate cache key from query and filters."""
    key_data = {"query": query, "filters": filters}
    return hashlib.md5(json.dumps(key_data, sort_keys=True).encode()).hexdigest()

# Cache for 5 minutes
@lru_cache(maxsize=100)
def cached_search(query: str, filters: dict):
    # Your search implementation
    pass
```

### 3. Set Appropriate Limits

- Default of 3 results is usually sufficient
- Higher limits increase latency
- Use batch search for multiple categories

### 4. Optimize Query Length

- Keep queries concise (10-50 words)
- Focus on intent, not full sentences
- Remove unnecessary words

## Error Handling

### 1. Implement Retry Logic

```python
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
async def search_with_retry(query: str):
    response = await client.post(
        "https://api.ad-tokens.com/search",
        headers={"x-api-key": "your-api-key-here"},
        json={"query": query}
    )
    response.raise_for_status()
    return response.json()
```

### 2. Handle Rate Limits

```python
async def search_with_rate_limit_handling(query: str):
    try:
        response = await client.post(
            "https://api.ad-tokens.com/search",
            headers={"x-api-key": "your-api-key-here"},
            json={"query": query}
        )
        return response.json()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            reset_time = int(e.response.headers.get("X-RateLimit-Reset", 0))
            wait_time = reset_time - int(time.time())
            await asyncio.sleep(max(0, wait_time))
            # Retry once
            return await search_with_rate_limit_handling(query)
        raise
```

### 3. Graceful Degradation

```python
async def search_with_fallback(query: str):
    try:
        response = await search_with_retry(query)
        return response["results"]
    except Exception as e:
        logger.error(f"Search failed: {e}")
        # Return empty results or cached results
        return []
```

## Security Best Practices

### 1. Never Commit API Keys

```python
# ❌ BAD
API_KEY = "at_live_abc123..."

# ✅ GOOD
import os
API_KEY = os.getenv("AD_TOKENS_API_KEY")
```

### 2. Rotate Keys Regularly

```python
# Rotate API key every 90 days
async def rotate_api_key(key_id: str):
    response = await client.post(
        f"https://api.ad-tokens.com/keys/{key_id}/rotate",
        headers={"Authorization": "Bearer your-jwt-token"}
    )
    new_key = response.json()["key"]
    # Update your environment variable
    update_env_var("AD_TOKENS_API_KEY", new_key)
```

### 3. Use Environment-Specific Keys

- Development key for testing
- Staging key for staging environment
- Production key for live traffic
- Never share keys between environments

### 4. Monitor Key Usage

- Check dashboard regularly for unusual activity
- Set up alerts for rate limit violations
- Revoke compromised keys immediately

## Attribution Compliance

### 1. Always Track Clicks

**Required for Skimlinks/Amazon compliance:**

```python
async def handle_product_click(impression_id: str):
    try:
        await client.post(
            f"https://api.ad-tokens.com/clicks/{impression_id}",
            headers={"x-api-key": "your-api-key-here"}
        )
    except Exception as e:
        logger.error(f"Click tracking failed: {e}")
        # Log but don't fail the user flow
```

### 2. Store Request IDs

```python
# Store request_id from search response
search_response = await search_products(query)
request_id = search_response["request_id"]

# Use request_id for analytics and debugging
store_request_id(request_id)
```

### 3. Track Conversions

```python
async def track_conversion(impression_id: str, conversion_value: float):
    await client.post(
        f"https://api.ad-tokens.com/clicks/{impression_id}",
        headers={"x-api-key": "your-api-key-here"},
        json={"conversion_value": conversion_value}
    )
```

## Privacy Compliance

### 1. Never Send PII

**Do NOT include:**
- Names
- Email addresses
- Phone numbers
- User IDs tied to PII
- IP addresses
- Any personally identifiable information

**Do include:**
- User intent ("looking for a laptop")
- Product preferences ("budget-friendly")
- Context ("for gaming")
- Anonymous session IDs

### 2. Use Anonymous Session IDs

```python
# ✅ GOOD: Generate anonymous session ID
import uuid
session_id = str(uuid.uuid4())

# ❌ BAD: Using user ID as session ID
session_id = user.email  # Never do this!
```

### 3. Sanitize Conversation Context

```python
def sanitize_conversation_context(messages: list) -> list:
    """Remove PII from conversation context."""
    sanitized = []
    for msg in messages:
        # Remove email addresses
        content = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', msg['content'])
        # Remove phone numbers
        content = re.sub(r'\b\d{3}-\d{3}-\d{4}\b', '[PHONE]', content)
        sanitized.append({**msg, 'content': content})
    return sanitized
```

## Conversation Context

### 1. Maintain Session State

```python
class ConversationSession:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.messages = []
    
    async def search(self, query: str):
        response = await client.post(
            "https://api.ad-tokens.com/search",
            headers={"x-api-key": "your-api-key-here"},
            json={
                "query": query,
                "session_id": self.session_id,
                "conversation_context": self.messages[-10:]  # Last 10 messages
            }
        )
        return response.json()
    
    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})
```

### 2. Limit Context Size

- Maximum 10 messages in conversation_context
- Keep messages concise
- Focus on product-related context

### 3. Use Session ID Consistently

```python
# Store session ID in user session/cookie
session_id = get_or_create_session_id(user_session)

# Use same session_id across requests
response = await search(query, session_id=session_id)
```

## Integration Patterns

### 1. OpenAI Function Calling

```python
def get_search_function_definition():
    return {
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
    }

# Use in OpenAI chat completion
response = await openai.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=[get_search_function_definition()],
    tool_choice="auto"
)
```

### 2. Anthropic Tool Use

```python
def get_search_tool_definition():
    return {
        "name": "search_products",
        "description": "Search for contextual product recommendations",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "limit": {"type": "integer", "default": 3}
            },
            "required": ["query"]
        }
    }

# Use in Anthropic messages
response = await anthropic.messages.create(
    model="claude-3-opus-20240229",
    messages=messages,
    tools=[get_search_tool_definition()],
    max_tokens=1024
)
```

## Monitoring & Observability

### 1. Log All Requests

```python
import logging

logger = logging.getLogger(__name__)

async def search_with_logging(query: str):
    start_time = time.time()
    try:
        response = await client.post(
            "https://api.ad-tokens.com/search",
            headers={"x-api-key": "your-api-key-here"},
            json={"query": query}
        )
        duration = time.time() - start_time
        logger.info("Search completed", extra={
            "query": query,
            "duration_ms": duration * 1000,
            "status_code": response.status_code,
            "request_id": response.json().get("request_id")
        })
        return response.json()
    except Exception as e:
        logger.error("Search failed", extra={
            "query": query,
            "error": str(e)
        })
        raise
```

### 2. Track Performance Metrics

```python
# Track response times
response_times = []

async def search_with_metrics(query: str):
    start = time.time()
    response = await search(query)
    duration = time.time() - start
    response_times.append(duration)
    
    # Log p95, p99 percentiles
    if len(response_times) % 100 == 0:
        sorted_times = sorted(response_times)
        p95 = sorted_times[int(len(sorted_times) * 0.95)]
        p99 = sorted_times[int(len(sorted_times) * 0.99)]
        logger.info(f"Response time p95: {p95*1000:.2f}ms, p99: {p99*1000:.2f}ms")
```

### 3. Monitor Error Rates

```python
error_counts = {"4xx": 0, "5xx": 0, "other": 0}

async def search_with_error_tracking(query: str):
    try:
        response = await search(query)
        return response
    except httpx.HTTPStatusError as e:
        if 400 <= e.response.status_code < 500:
            error_counts["4xx"] += 1
        elif e.response.status_code >= 500:
            error_counts["5xx"] += 1
        raise
    except Exception as e:
        error_counts["other"] += 1
        raise
```

## Next Steps

- Review [Code Examples](../examples/) for complete integration patterns
- Check [Analytics Guide](analytics.md) for performance monitoring
- Read [FAQ](faq.md) for common questions

