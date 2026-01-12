/**
 * Basic Product Search Example (TypeScript)
 * 
 * This example demonstrates how to perform a simple product search
 * using the Ad-Tokens API with TypeScript type safety.
 */

// Type definitions based on OpenAPI spec
interface AdResponse {
  product_id: string;
  impression_id: string;
  title: string;
  description: string;
  url: string;
  price: string;
  merchant: string;
  brand: string;
  relevance_score: number;
  relevance_explanation: string;
  currency: string;
  last_updated_at?: string;
  image_url?: string;
  disclosure_text?: string;
}

interface SearchResponse {
  request_id: string;
  results: AdResponse[];
  metadata: {
    total_matches?: number;
    session_id?: string;
    model_version?: string;
  };
}

interface SearchRequest {
  query: string;
  limit?: number;
  filters?: {
    min_price?: number;
    max_price?: number;
    merchant?: string;
    brand?: string;
    category?: string;
    keyword_filter?: string;
  };
  sort?: 'relevance' | 'price_asc' | 'price_desc';
  session_id?: string;
}

/**
 * Search for products using the Ad-Tokens API.
 * 
 * @param query - The search query (user intent)
 * @param apiKey - Your Ad-Tokens API key
 * @param options - Optional search parameters
 * @returns Promise with search results
 */
async function searchProducts(
  query: string,
  apiKey: string,
  options: Partial<SearchRequest> = {}
): Promise<SearchResponse> {
  try {
    const requestBody: SearchRequest = {
      query,
      limit: 3,
      ...options,
    };

    const response = await fetch('https://api.ad-tokens.com/search', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${error.message}`
      );
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
async function main(): Promise<void> {
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
      console.log(
        `   Relevance: ${(product.relevance_score * 100).toFixed(2)}%`
      );
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
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error(`❌ Error: ${error}`);
    }
  }
}

// Run if this is the main module
if (require.main === module) {
  main();
}

// Export for use in other modules
export { searchProducts, type SearchResponse, type AdResponse };

