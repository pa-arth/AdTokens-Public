# Ad-Tokens API

> The monetization layer for the Agentic Era. RAG-powered contextual commerce injection for AI agents and LLM applications.

[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128+-green.svg)](https://fastapi.tiangolo.com)
[![Status: Production](https://img.shields.io/badge/status-production-green.svg)](https://api.ad-tokens.com/health)

## Why Ad-Tokens?

AI agents and LLM applications need a way to monetize without breaking the user experience. Traditional affiliate links feel intrusive and break the conversational flow. Ad-Tokens solves this by providing **contextual product recommendations** that feel natural in agent conversations.

**Built for the Agentic Era**: Sub-100ms latency, developer-first design, and seamless integration with OpenAI, Anthropic, and other LLM platforms.

## Key Features

- 🚀 **High-Performance RAG Engine**: Vector search powered by LanceDB Cloud with sub-0ms response times
- 🤖 **Agent-Optimized**: Designed for seamless integration with AI agents and LLM workflows
- 🔐 **Developer-First Security**: API key management, JWT authentication, and request attribution
- 📊 **Built-in Analytics**: Request tracking, attribution, and performance metrics
- 🎯 **Contextual Matching**: Intent-based product recommendations using OpenAI embeddings
- ⚡ **Async-First**: Built on FastAPI for high-concurrency agentic traffic
- ✅ **Compliance Built-In**: Skimlinks/Amazon attribution tracking for every ad served

## Use Cases

### AI Agents & Autonomous Systems
Integrate contextual productions into your AI agent's responses. Perfect for:
- Customer service bots that can suggest relevant products
- Personal shopping assistants
- Travel planning agents
- Educational bots that recommend learning resources

### LLM Applications
Add monetization to your LLM-powered applications:
- Chat interfaces with natural product recommendations
- Content generation tools that include affiliate links
- Conversational commerce platforms
- Multi-modal AI applications

### Chatbots & Virtual Assistants
Enhance your chatbot with contextual commerce:
- E-commerce chatbots
- Support bots with product suggestions
- Lifestyle and recommendation bots
- Industry-specific virtual assistants

## Quick Start

### Get Your API Key

1. Sign up at [https://www.ad-tokens.com](https://www.ad-tokens.com)
2. Create an API key from the dashboard
3. Start making requests!

### Your First Search (Python)

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
    for product in data["results"]:
        print(f"{product['title']} - {product['price']}")
```

### Your First Search (JavaScript)

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
data.results.forEach(product => {
  console.log(`${product.title} - ${product.price}`);
});
```

### Your First Search (cURL)

```bash
curl -X POST https://api.ad-tokens.com/search \
  -H "x-api-key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "wireless headphones for running",
    "limit": 3
  }'
```

## Performance

- **Sub-100ms latency**: Optimized for real-time agent responses
- **99.9% uptime**: Production-grade infrastructure
- **Global CDN**: Low latency worldwide
- **Streaming support**: Server-Sent Events for real-time results

## Documentation

- 📖 [Quick Start Guide](docs/quick-start.md) - Get up and running in 5 minutes
- 🔐 [Authentication Guide](docs/authentication.md) - API keys and JWT tokens
- 🔍 [Search API Guide](docs/search-guide.md) - Complete search reference
- 📊 [Analytics Guide](docs/analytics.md) - Metrics and dashboards
- 💡 [Best Practices](docs/best-practices.md) - Performance tips and patterns
- ❓ [FAQ](docs/faq.md) - Common questions answered

## Code Examplee working examples in multiple languages:

- [Python Examples](examples/python/) - Complete Python integration examples
- [JavaScript Examples](examples/javascript/) - Browser and Node.js examples
- [TypeScript Examples](examples/typescript/) - Type-safe TypeScript examples
- [cURL Examples](examples/curl/) - Quick testing scripts

## API Reference

- **Interactive Docs**: [https://api.ad-tokens.com/docs](https://api.ad-tokens.com/docs) (when running locally)
- **OpenAPI Spec**: [openapi.yaml](openapi.yaml)
- **Postman Collection**: See [postman/README.md](postman/README.md) for import instructions

## Built With

- [FastAPI](https://fastapi.tiangolo.com) - Modern Python web framework
- [LanceDB Cloud](https://lancedb.com) - Vector database for embeddings
- [Supabase](https://supabase.com) - Backend-as-a-Service
- [OpenAI](https://openai.com) - Embedding generation

## License

This project is licensed under a proprieatary license - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [https://docs.ad-tokens.com](https://docs.ad-tokens.com)
- **Dashboard**: [https://www.ad-tokens.com](https://www.ad-tokens.com)
- **Email**: hello@ad-tokens.com
- **Issues**: [GitHub Issues](https://github.com/pa-arth/AdAPI/issues)

---

**Made for developers building the future of AI agents** 🤖

Get started today: [https://www.ad-tokens.com](https://www.ad-tokens.com)

