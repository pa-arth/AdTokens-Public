/**
 * Streaming Search Example (TypeScript)
 * 
 * This example demonstrates how to use Server-Sent Events (SSE) streaming
 * to receive search results in real-time with TypeScript.
 */

interface StreamingProduct {
  product_id: string;
  impression_id: string;
  title: string;
  price: string;
  relevance_score: number;
}

interface StreamingData {
  results?: StreamingProduct[];
  metadata?: {
    total_matches?: number;
  };
}

/**
 * Perform a streaming search using Server-Sent Events.
 * 
 * @param query - The search query
 * @param apiKey - Your Ad-Tokens API key
 */
async function streamSearch(query: string, apiKey: string): Promise<void> {
  try {
    const response = await fetch('https://api.ad-tokens.com/search', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        limit: 5,
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${error.message}`
      );
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    console.log(`🔍 Streaming search for: ${query}\n`);
    console.log('📡 Waiting for results...\n');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let productsReceived = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // SSE format: "event: result\ndata: {...}\n\n"
        if (trimmed.startsWith('event: ')) {
          const eventType = trimmed.slice(7);
          // Handle event type if needed
          continue;
        }

        if (trimmed.startsWith('data: ')) {
          try {
            const data: StreamingData = JSON.parse(trimmed.slice(6));

            // Handle different event types
            if (data.results) {
              for (const product of data.results) {
                productsReceived++;
                console.log(
                  `✅ Product ${productsReceived}: ${product.title}`
                );
                console.log(`   Price: ${product.price}`);
                console.log(
                  `   Relevance: ${(product.relevance_score * 100).toFixed(2)}%\n`
                );
              }
            }

            if (data.metadata?.total_matches) {
              console.log(`📊 Total matches: ${data.metadata.total_matches}`);
            }
          } catch (e) {
            if (e instanceof Error) {
              console.warn(`⚠️  Failed to parse JSON: ${e.message}`);
            }
            console.warn(`   Line: ${trimmed}`);
          }
        }
      }
    }

    console.log(`\n✨ Received ${productsReceived} products via streaming`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error(`❌ Error: ${error}`);
    }
  }
}

/**
 * Main function to demonstrate streaming search.
 */
async function main(): Promise<void> {
  const apiKey = process.env.AD_TOKENS_API_KEY || 'your-api-key-here';

  if (apiKey === 'your-api-key-here') {
    console.error('⚠️  Please set AD_TOKENS_API_KEY environment variable');
    return;
  }

  const query = 'mechanical keyboard for programming';
  await streamSearch(query, apiKey);
}

// Run if this is the main module
if (require.main === module) {
  main();
}

// Export for use in other modules
export { streamSearch };

