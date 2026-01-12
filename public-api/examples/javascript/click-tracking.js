/**
 * Click Tracking Example
 * 
 * This example demonstrates how to track product clicks for attribution compliance.
 * Click tracking is required for Skimlinks/Amazon compliance.
 */

/**
 * Search for products.
 * 
 * @param {string} query - Search query
 * @param {string} apiKey - API key
 * @returns {Promise<Object>} Search results
 */
async function searchProducts(query, apiKey) {
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Track a product click for attribution compliance.
 * 
 * @param {string} impressionId - The impression_id from the product result
 * @param {string} apiKey - Your Ad-Tokens API key
 * @param {string} [requestId] - Optional request_id from the original search
 * @returns {Promise<Object>} Click tracking confirmation
 */
async function trackClick(impressionId, apiKey, requestId = null) {
  try {
    const payload = {};
    if (requestId) {
      payload.request_id = requestId;
    }

    const response = await fetch(
      `https://api.ad-tokens.com/clicks/${impressionId}`,
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Click tracking error:', error);
    throw error;
  }
}

/**
 * Simulate a user clicking on a product.
 * In a real application, this would be triggered by actual user interaction.
 * 
 * @param {Object} product - Product object from search results
 * @param {string} requestId - Request ID from search
 * @param {string} apiKey - API key
 */
async function simulateUserClick(product, requestId, apiKey) {
  const impressionId = product.impression_id;
  const productTitle = product.title;

  console.log(`👆 User clicked on: ${productTitle}`);
  console.log(`   Tracking click for impression: ${impressionId}`);

  try {
    const result = await trackClick(impressionId, apiKey, requestId);
    console.log(`✅ Click tracked successfully`);
    console.log(`   Timestamp: ${result.timestamp || 'N/A'}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to track click: ${error.message}`);
    // In production, you might want to retry or log this
    return null;
  }
}

/**
 * Main function to demonstrate click tracking.
 */
async function main() {
  const apiKey = process.env.AD_TOKENS_API_KEY || 'your-api-key-here';

  if (apiKey === 'your-api-key-here') {
    console.error('⚠️  Please set AD_TOKENS_API_KEY environment variable');
    return;
  }

  // Step 1: Search for products
  const query = 'wireless headphones';
  console.log(`🔍 Searching for: ${query}\n`);

  try {
    const searchResult = await searchProducts(query, apiKey);
    const requestId = searchResult.request_id;

    console.log(`✅ Found ${searchResult.results.length} products\n`);
    console.log(`Request ID: ${requestId}\n`);

    // Display products
    searchResult.results.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   URL: ${product.url}`);
      console.log(`   Impression ID: ${product.impression_id}\n`);
    });

    // Step 2: Simulate user clicking on the first product
    console.log('-'.repeat(50));
    if (searchResult.results.length > 0) {
      const firstProduct = searchResult.results[0];
      await simulateUserClick(firstProduct, requestId, apiKey);
    }

    console.log('\n💡 In your application:');
    console.log('   1. Display products from search results');
    console.log('   2. When user clicks a product link, call trackClick()');
    console.log('   3. Then redirect user to product URL');
    console.log('   4. This ensures compliance with Skimlinks/Amazon requirements');
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
  module.exports = { searchProducts, trackClick };
}

