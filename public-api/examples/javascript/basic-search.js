/**
 * Basic Product Search Example
 * 
 * This example demonstrates how to perform a simple product search
 * using the Ad-Tokens API in JavaScript (browser or Node.js).
 */

/**
 * Search for products using the Ad-Tokens API.
 * 
 * @param {string} query - The search query (user intent)
 * @param {string} apiKey - Your Ad-Tokens API key
 * @returns {Promise<Object>} Search results
 */
async function searchProducts(query, apiKey) {
  try {
    const response = await fetch('https://api.ad-tokens.com/search', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        limit: 3,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

/**
 * Main function to demonstrate basic search.
 */
async function main() {
  // Get API key from environment variable or replace with your key
  const apiKey = process.env.AD_TOKENS_API_KEY || 'your-api-key-here';

  if (apiKey === 'your-api-key-here') {
    console.error('⚠️  Please set AD_TOKENS_API_KEY environment variable');
    console.error('   Example: export AD_TOKENS_API_KEY="at_live_..."');
    return;
  }

  // Perform search
  const query = 'wireless headphones for running';
  console.log(`🔍 Searching for: ${query}\n`);

  try {
    const result = await searchProducts(query, apiKey);

    // Display results
    console.log(`✅ Found ${result.results.length} products\n`);
    console.log(`Request ID: ${result.request_id}\n`);

    result.results.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   Merchant: ${product.merchant}`);
      console.log(`   Relevance: ${(product.relevance_score * 100).toFixed(2)}%`);
      console.log(`   Explanation: ${product.relevance_explanation}`);
      console.log(`   URL: ${product.url}`);
      console.log(`   Impression ID: ${product.impression_id}`);
      console.log();
    });

    // Display metadata
    if (result.metadata) {
      if (result.metadata.total_matches) {
        console.log(`Total matches: ${result.metadata.total_matches}`);
      }
      if (result.metadata.session_id) {
        console.log(`Session ID: ${result.metadata.session_id}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Run if this is the main module
if (typeof require !== 'undefined' && require.main === module) {
  main();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { searchProducts };
}

