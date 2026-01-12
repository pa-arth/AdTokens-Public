# Frequently Asked Questions

Common questions about Ad-Tokens API.

## General

### What is Ad-Tokens?

Ad-Tokens is a RAG-powered API that provides contextual product recommendations for AI agents and LLM applications. It enables developers to monetize their AI applications through affiliate links while maintaining a natural user experience.

### Who is Ad-Tokens for?

Ad-Tokens is designed for:
- Developers building AI agents and autonomous systems
- LLM application developers
- Chatbot and virtual assistant creators
- Anyone building conversational commerce experiences

### How does it work?

1. You send a user query or conversation context to the API
2. The API generates an embedding and searches a vector database
3. Returns the most relevant products with affiliate links
4. You display products in your agent's response
5. Track clicks for attribution compliance

## Pricing & Limits

### Is there a free tier?

Yes! We offer a free tier for developers to get started. Check [https://www.ad-tokens.com/pricing](https://www.ad-tokens.com/pricing) for current pricing.

### What are the rate limits?

Rate limits vary by plan. Check the `X-RateLimit-Limit` header in API responses for your current limit. Free tier typically includes 1000 requests per month.

### What happens if I exceed my rate limit?

You'll receive a `429 Rate Limit Exceeded` response. Check the `X-RateLimit-Reset` header for when the limit resets. You can upgrade your plan for higher limits.

### How is pricing calculated?

Pricing is based on API requests. Each search request counts toward your usage. Check the dashboard for detailed usage statistics.

## Technical

### What is the API latency?

We target sub-100ms response times for agentic workflows. Actual latency depends on:
- Query complexity
- Number of results requested
- Network conditions
- Cache hit rate

Check the `X-Search-Time` header in responses for actual search latency.

### Do you support streaming?

Yes! Set `"stream": true` in your search request to receive Server-Sent Events (SSE) stream. This provides real-time results as they're found.

### Can I filter results?

Yes! Use the `filters` parameter to filter by:
- Price range (`min_price`, `max_price`)
- Merchant name
- Brand
- Category
- Keywords

### How do I find similar products?

Use the `/products/{product_id}/similar` endpoint to find products similar to a given product. This uses vector similarity and collaborative filtering.

### Can I exclude products from results?

Yes! Use the `exclude_product_ids` parameter to exclude specific products. Useful for avoiding duplicates in the same conversation.

### What is conversation context?

Conversation context is the history of messages in a conversation. Providing this helps the API understand user intent across multiple turns, improving relevance.

**Important**: Never include PII (names, emails, phone numbers) in conversation context. Only include intent and product-related context.

### How do I handle errors?

Implement retry logic with exponential backoff for transient errors (5xx). For rate limits (429), wait for the reset time. For client errors (4xx), check the error message for details.

See [Best Practices](best-practices.md) for error handling patterns.

## Integration

### How do I integrate with OpenAI?

Use OpenAI Function Calling. Request a tool definition from the search API and include it in your chat completion:

```python
# Request tool definition
response = await search(query, tool_definition={"format": "openai_function"})
tool_def = response["metadata"]["tool_definition"]

# Use in OpenAI
response = await openai.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=[tool_def]
)
```

See [Code Examples](../examples/) for complete integration patterns.

### How do I integrate with Anthropic Claude?

Similar to OpenAI, but use `"format": "anthropic_tool"` in the tool definition request. See the examples for complete integration.

### Can I use this in a browser?

Yes! The API supports CORS. Use the JavaScript examples for browser integration. Make sure to keep your API key secure - never expose it in client-side code. Use a backend proxy if needed.

### Do you have SDKs?

Currently, we provide code examples in Python, JavaScript, and TypeScript. SDKs may be available in the future. Check the [examples](../examples/) directory for integration patterns.

## Compliance & Attribution

### Why do I need to track clicks?

Click tracking is required for Skimlinks/Amazon compliance. Every ad served must be traceable via a unique `impression_id`. This ensures proper attribution and compliance with affiliate program terms.

### How do I track clicks?

Call the `/clicks/{impression_id}` endpoint when a user clicks on a product. The `impression_id` is provided in each product result.

```python
await client.post(
    f"https://api.ad-tokens.com/clicks/{impression_id}",
    headers={"x-api-key": "your-api-key-here"}
)
```

### What is the disclosure text?

The `disclosure_text` field in product results contains required affiliate disclosure (e.g., "As an Amazon Associate, we earn from qualifying purchases."). You must display this with products for compliance.

### Do I need to display the disclosure?

Yes, for compliance with affiliate program terms. The disclosure text is provided in each product result.

## Privacy & Security

### What data do you store?

We store:
- API request logs (for analytics and debugging)
- Click tracking data (for attribution)
- Session data (for conversation context)
- Feedback data (for improving relevance)

We do NOT store:
- PII (personally identifiable information)
- User names or email addresses
- Phone numbers
- Any data that can identify individual users

### Can I use this without storing user data?

Yes! Use anonymous session IDs and don't include PII in queries or conversation context. The API works entirely with intent and context, not user identity.

### How secure are API keys?

API keys are hashed using Argon2 before storage. Never share your API key or commit it to version control. Use environment variables or secret management services.

### Can I revoke an API key?

Yes! Use the `/keys/{key_id}` DELETE endpoint or revoke it from the dashboard. Revoked keys cannot be used for authentication.

## Support

### Where can I get help?

- **Documentation**: [https://docs.ad-tokens.com](https://docs.ad-tokens.com)
- **Email**: hello@ad-tokens.com
- **GitHub Issues**: [https://github.com/pa-arth/AdAPI/issues](https://github.com/pa-arth/AdAPI/issues)
- **Dashboard**: [https://www.ad-tokens.com](https://www.ad-tokens.com)

### How do I report a bug?

Open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- API request/response (sanitized, no API keys)
- Error messages or logs

### Can I request a feature?

Yes! Open a GitHub issue with the "feature request" label. Include:
- Use case description
- Proposed API changes
- Benefits to developers

### Do you offer enterprise support?

Contact hello@ad-tokens.com for enterprise support, custom integrations, and SLA requirements.

## Next Steps

- Check out [Quick Start Guide](quick-start.md) to get started
- Read [Best Practices](best-practices.md) for production deployments
- Review [Code Examples](../examples/) for integration patterns

