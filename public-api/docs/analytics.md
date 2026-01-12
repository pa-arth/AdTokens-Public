# Analytics Guide

Track performance, monitor usage, and optimize your integration with Ad-Tokens analytics.

## Overview

Ad-Tokens provides comprehensive analytics to help you:
- Monitor API usage and performance
- Track click-through rates and conversions
- Identify top-performing products and queries
- Optimize your integration for better results

## Usage Statistics

Get usage statistics for your API keys:

```python
import httpx
from datetime import datetime, timedelta

async with httpx.AsyncClient() as client:
    response = await client.get(
        "https://api.ad-tokens.com/usage",
        headers={
            "Authorization": "Bearer your-jwt-token",
            "Content-Type": "application/json",
        },
        params={
            "start_date": (datetime.now() - timedelta(days=30)).isoformat(),
            "end_date": datetime.now().isoformat()
        }
    )
    data = response.json()
    print(f"Total requests: {data['total_requests']}")
    print(f"Search queries: {data['search_queries']}")
```

### Response Structure

```json
{
  "period_start": "2024-01-01T00:00:00Z",
  "period_end": "2024-01-31T23:59:59Z",
  "total_requests": 1250,
  "search_queries": 980,
  "rate_limit": {
    "limit": 1000,
    "remaining": 750,
    "reset_at": "2024-02-01T00:00:00Z"
  }
}
```

## Analytics Dashboard

Get comprehensive analytics data:

```python
response = await client.get(
    "https://api.ad-tokens.com/analytics",
    headers={"Authorization": "Bearer your-jwt-token"},
    params={
        "start_date": "2024-01-01T00:00:00Z",
        "end_date": "2024-01-31T23:59:59Z",
        "metric": "ctr"  # Optional: ctr, conversion_rate, revenue, top_products, top_queries
    }
)
data = response.json()
```

### Response Structure

```json
{
  "period_start": "2024-01-01T00:00:00Z",
  "period_end": "2024-01-31T23:59:59Z",
  "metrics": {
    "total_searches": 1250,
    "total_clicks": 87,
    "click_through_rate": 6.96,
    "total_conversions": 12,
    "conversion_rate": 0.96,
    "total_revenue": 1250.50,
    "average_relevance_score": 0.87
  },
  "top_products": [
    {
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Sony WH-1000XM5 Headphones",
      "click_count": 25,
      "conversion_count": 4,
      "revenue": 1392.00
    }
  ],
  "top_queries": [
    {
      "query": "wireless headphones",
      "search_count": 45,
      "avg_relevance_score": 0.92
    }
  ]
}
```

## Performance Metrics

Monitor API performance:

```python
response = await client.get(
    "https://api.ad-tokens.com/analytics/performance",
    headers={"Authorization": "Bearer your-jwt-token"},
    params={
        "timeframe": "24h",  # 1h, 24h, 7d, 30d
        "start_date": "2024-01-01T00:00:00Z",
        "end_date": "2024-01-31T23:59:59Z"
    }
)
data = response.json()
```

### Response Structure

```json
{
  "period_start": "2024-01-01T00:00:00Z",
  "period_end": "2024-01-31T23:59:59Z",
  "timeframe": "24h",
  "request_volume": [
    {
      "time": "2024-01-01T00:00:00Z",
      "count": 45
    },
    {
      "time": "2024-01-01T01:00:00Z",
      "count": 52
    }
  ],
  "response_time": {
    "p50": 45.2,
    "p95": 89.5,
    "p99": 125.3
  },
  "status_codes": {
    "2xx": 1200,
    "4xx": 30,
    "5xx": 2
  }
}
```

## Dashboard Statistics

Get overview statistics for the dashboard:

```python
response = await client.get(
    "https://api.ad-tokens.com/dashboard/stats",
    headers={"Authorization": "Bearer your-jwt-token"}
)
data = response.json()
```

### Response Structure

```json
{
  "total_revenue": 1250.50,
  "active_api_keys": 3,
  "ad_requests_24h": 125
}
```

## API Logs

Query API logs for debugging and monitoring:

```python
response = await client.get(
    "https://api.ad-tokens.com/logs",
    headers={"Authorization": "Bearer your-jwt-token"},
    params={
        "start_date": "2024-01-01T00:00:00Z",
        "end_date": "2024-01-31T23:59:59Z",
        "status_code": 200,
        "method": "POST",
        "endpoint": "/search",
        "limit": 50,
        "offset": 0
    }
)
data = response.json()
```

### Response Structure

```json
{
  "logs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "request_id": "789e0123-e45b-67c8-d901-234567890abc",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "api_key_id": "456e7890-e12b-34c5-d678-901234567890",
      "api_key_name": "Production Bot",
      "api_key_prefix": "at_live_",
      "method": "POST",
      "endpoint": "/search",
      "status_code": 200,
      "response_time_ms": 45.2,
      "request_body": {
        "query": "wireless headphones",
        "limit": 3
      },
      "response_body": {
        "request_id": "789e0123-e45b-67c8-d901-234567890abc",
        "results": [...]
      },
      "client_ip": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1250,
  "limit": 50,
  "offset": 0
}
```

## Sessions

List active conversation sessions:

```python
response = await client.get(
    "https://api.ad-tokens.com/sessions",
    headers={"Authorization": "Bearer your-jwt-token"},
    params={
        "limit": 50,
        "offset": 0
    }
)
data = response.json()
```

### Response Structure

```json
[
  {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2024-01-15T10:00:00Z",
    "last_activity_at": "2024-01-15T10:30:00Z",
    "total_searches": 5,
    "total_clicks": 2,
    "conversion_rate": 0.4
  }
]
```

## Key Metrics to Track

### Click-Through Rate (CTR)
- **Formula**: (Total Clicks / Total Searches) × 100
- **Target**: 5-10% is good, 10%+ is excellent
- **Improvement**: Better query context, more relevant products

### Conversion Rate
- **Formula**: (Total Conversions / Total Clicks) × 100
- **Target**: 1-3% is typical for e-commerce
- **Improvement**: Better product matching, clearer product information

### Average Relevance Score
- **Range**: 0.0 to 1.0
- **Target**: 0.8+ indicates good matching
- **Improvement**: Provide better conversation context, use session_id

### Response Time
- **Target**: Sub-100ms for agentic workflows
- **Monitoring**: Track p95 and p99 percentiles
- **Optimization**: Use caching, optimize query length

## Integration Tips

1. **Monitor rate limits**
   - Check `X-RateLimit-Remaining` header
   - Implement backoff strategies
   - Upgrade plan if consistently hitting limits

2. **Track performance trends**
   - Monitor response times over time
   - Identify slow queries
   - Optimize based on analytics

3. **A/B test different strategies**
   - Use `experiment_id` parameter
   - Compare different query formulations
   - Test different limit values

4. **Use session data**
   - Analyze top queries to understand user intent
   - Identify patterns in successful sessions
   - Optimize based on conversion data

## Next Steps

- Review [Best Practices](best-practices.md) for optimization tips
- Check out [Code Examples](../examples/) for analytics integration patterns
- Visit the [Dashboard](https://www.ad-tokens.com) for visual analytics

