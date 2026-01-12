/**
 * AI Agent Integration Example
 * 
 * This example demonstrates how to integrate Ad-Tokens API with AI agents
 * for contextual product recommendations.
 */

/**
 * Wrapper class for integrating Ad-Tokens with AI agents.
 */
class AdTokensAgent {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.ad-tokens.com';
    this.sessionId = null;
  }

  /**
   * Search for products with optional conversation context.
   * 
   * @param {string} query - User query or intent
   * @param {number} limit - Number of results (1-10)
   * @param {Array} conversationContext - Optional conversation history
   * @returns {Promise<Object>} Search results with products
   */
  async searchProducts(query, limit = 3, conversationContext = null) {
    const payload = {
      query: query,
      limit: limit,
    };

    if (this.sessionId) {
      payload.session_id = this.sessionId;
    }

    if (conversationContext) {
      payload.conversation_context = conversationContext;
    }

    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Store session_id for future requests
    if (result.metadata && result.metadata.session_id) {
      this.sessionId = result.metadata.session_id;
    }

    return result;
  }

  /**
   * Format products in a way that's easy for the agent to include in responses.
   * 
   * @param {Array} products - List of product objects
   * @returns {string} Formatted string for agent response
   */
  formatProductsForAgent(products) {
    if (!products || products.length === 0) {
      return 'No products found.';
    }

    let formatted = 'Here are some product recommendations:\n\n';

    products.forEach((product, index) => {
      formatted += `${index + 1}. **${product.title}**\n`;
      formatted += `   - Price: ${product.price}\n`;
      formatted += `   - Merchant: ${product.merchant}\n`;
      formatted += `   - ${product.relevance_explanation}\n`;
      formatted += `   - [View Product](${product.url})\n\n`;
    });

    if (products[0].disclosure_text) {
      formatted += `\n${products[0].disclosure_text}\n`;
    }

    return formatted;
  }

  /**
   * Track a product click for attribution.
   * 
   * @param {string} impressionId - Impression ID from product
   */
  async trackClick(impressionId) {
    try {
      await fetch(`${this.baseUrl}/clicks/${impressionId}`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
        },
      });
    } catch (error) {
      console.warn(`Warning: Failed to track click: ${error.message}`);
    }
  }
}

/**
 * Simulate an AI agent conversation with product recommendations.
 */
async function simulateAgentConversation() {
  const apiKey = process.env.AD_TOKENS_API_KEY || 'your-api-key-here';

  if (apiKey === 'your-api-key-here') {
    console.error('⚠️  Please set AD_TOKENS_API_KEY environment variable');
    return;
  }

  const agent = new AdTokensAgent(apiKey);

  // Simulate conversation
  const conversation = [
    { role: 'user', content: 'I need a microphone' },
    { role: 'assistant', content: 'What will you be using it for?' },
    { role: 'user', content: 'Recording podcasts' },
  ];

  console.log('🤖 Agent Conversation Simulation\n');
  console.log('User: I need a microphone');
  console.log('Agent: What will you be using it for?');
  console.log('User: Recording podcasts\n');

  // Search for products with conversation context
  console.log('🔍 Agent searching for products...\n');

  try {
    const result = await agent.searchProducts(
      'podcast microphone',
      3,
      conversation
    );

    const products = result.results;
    const formattedProducts = agent.formatProductsForAgent(products);

    console.log('Agent Response:');
    console.log('-'.repeat(50));
    console.log(formattedProducts);
    console.log('-'.repeat(50));

    // Display raw product data for reference
    console.log('\n📦 Product Data (for agent processing):');
    products.forEach((product) => {
      console.log(`\n  Product ID: ${product.product_id}`);
      console.log(`  Impression ID: ${product.impression_id}`);
      console.log(`  Title: ${product.title}`);
      console.log(`  Relevance Score: ${(product.relevance_score * 100).toFixed(2)}%`);
    });

    console.log('\n💡 Integration Tips:');
    console.log('   1. Use conversation_context to improve relevance');
    console.log('   2. Store session_id for multi-turn conversations');
    console.log('   3. Format products naturally in agent responses');
    console.log('   4. Track clicks when users click product links');
    console.log('   5. Never include PII in conversation context');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Run if this is the main module
if (typeof require !== 'undefined' && require.main === module) {
  simulateAgentConversation();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AdTokensAgent };
}

