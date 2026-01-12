/**
 * Batch Search Example
 * 
 * This example demonstrates how to search for multiple queries in a single request,
 * which is more efficient than making multiple sequential calls.
 */

/**
 * Perform batch search for multiple queries.
 * 
 * @param {string[]} queries - Array of search queries
 * @param {string} apiKey - Your Ad-Tokens API key
 * @returns {Promise<Object>} Batch search results
 */
async function batchSearch(queries, apiKey) {
  try {
    // Prepare batch request
    const batchRequest = {
      queries: queries.map(query => ({
        query: query,
        limit: 3,
      })),
    };

    const response = await fetch('https://api.ad-tokens.com/search/batch', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Batch search error:', error);
    throw error;
  }
}

/**
 * Main function to demonstrate batch search.
 */
async function main() {
  const apiKey = process.env.AD_TOKENS_API_KEY || 'your-api-key-here';

  if (apiKey === 'your-api-key-here') {
    console.error('⚠️  Please set AD_TOKENS_API_KEY environment variable');
    return;
  }

  // Multiple queries to search
  const queries = [
    'wireless headphones',
    'mechanical keyboard',
    'gaming mouse',
  ];

  console.log(`🔍 Batch searching for ${queries.length} queries...\n`);

  try {
    const result = await batchSearch(queries, apiKey);

    // Display results for each query
    result.results.forEach((searchResult, index) => {
      const query = queries[index];
      console.log(`📦 Query ${index + 1}: ${query}`);
      console.log(`   Found ${searchResult.results.length} products\n`);

      searchResult.results.forEach((product, productIndex) => {
        console.log(`   ${productIndex + 1}. ${product.title}`);
        console.log(`      Price: ${product.price}`);
        console.log(`      Relevance: ${(product.relevance_score * 100).toFixed(2)}%`);
      });

      console.log();
    });

    // Display batch metadata
    if (result.metadata) {
      if (result.metadata.total_queries) {
        console.log(`✅ Processed ${result.metadata.total_queries} queries`);
      }
      if (result.metadata.total_time_ms) {
        console.log(`⏱️  Total time: ${result.metadata.total_time_ms.toFixed(2)}ms`);
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
  module.exports = { batchSearch };
}

