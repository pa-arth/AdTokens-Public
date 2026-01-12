# Postman Collection

Import the Ad-Tokens API OpenAPI specification into Postman to get a complete collection with all endpoints, examples, and authentication configured.

## Quick Import

### Option 1: Import from OpenAPI Spec

1. Open Postman
2. Click **Import** in the top left
3. Select **Link** tab
4. Enter: `https://api.ad-tokens.com/openapi.yaml`
5. Click **Continue** and then **Import**

### Option 2: Import from Local File

1. Open Postman
2. Click **Import** in the top left
3. Select **File** tab
4. Navigate to the `openapi.yaml` file in this repository
5. Click **Import**

### Option 3: Generate Collection from OpenAPI

If you prefer to generate a Postman Collection v2.1 file:

1. Use [OpenAPI to Postman](https://www.postman.com/openapi-to-postman/) converter
2. Or use the Postman CLI:
   ```bash
   npm install -g postman-cli
   postman convert openapi.yaml -o Ad-Tokens-API.postman_collection.json
   ```

## Environment Setup

After importing, create a Postman environment with these variables:

### Variables

| Variable | Initial Value | Current Value | Description |
|----------|---------------|---------------|-------------|
| `base_url` | `https://api.ad-tokens.com` | `https://api.ad-tokens.com` | API base URL |
| `api_key` | `your-api-key-here` | `your-api-key-here` | Your Ad-Tokens API key |
| `jwt_token` | `your-jwt-token` | `your-jwt-token` | Supabase JWT token (for user endpoints) |

### Setting Up Environment

1. In Postman, click **Environments** in the left sidebar
2. Click **+** to create a new environment
3. Name it "Ad-Tokens Production" (or similar)
4. Add the variables above
5. Set `api_key` to your actual API key
6. Save the environment
7. Select it from the environment dropdown (top right)

## Authentication

The collection uses two authentication methods:

### API Key Authentication

For search and attribution endpoints:
- Header: `x-api-key: {{api_key}}`
- Set in collection variables or environment

### JWT Bearer Token

For developer portal endpoints:
- Header: `Authorization: Bearer {{jwt_token}}`
- Get JWT token from Supabase Auth

## Collection Structure

After import, you'll have endpoints organized by feature:

- **Ad Engine**
  - `POST /search` - Contextual ad search
  - `POST /search/batch` - Batch search
  - `GET /products/{product_id}/similar` - Similar products

- **Developer Portal**
  - `GET /keys` - List API keys
  - `POST /keys` - Create API key
  - `DELETE /keys/{key_id}` - Delete API key
  - `GET /usage` - Usage statistics
  - `GET /analytics` - Analytics data
  - `GET /sessions` - List sessions
  - `GET /webhooks` - List webhooks
  - `POST /webhooks` - Create webhook

- **Attribution**
  - `POST /clicks/{impression_id}` - Track click
  - `POST /feedback` - Submit feedback

- **Infrastructure**
  - `GET /health` - Health check

## Example Requests

Each endpoint includes example requests with sample data. Update the variables in the examples to match your use case.

## Testing

1. Start with the **Health Check** endpoint (no auth required)
2. Test **Search** endpoint with your API key
3. Try **Batch Search** for multiple queries
4. Test **Click Tracking** with an impression_id from search results

## Troubleshooting

### 401 Unauthorized
- Check that `api_key` is set correctly in your environment
- Verify the API key is active in the dashboard

### 429 Rate Limit Exceeded
- Check rate limit headers in response
- Wait for reset time or upgrade your plan

### Import Errors
- Ensure you're using OpenAPI 3.0 spec
- Check that the spec file is valid YAML/JSON
- Try importing from the production URL instead

## Resources

- **API Documentation**: [https://docs.ad-tokens.com](https://docs.ad-tokens.com)
- **Dashboard**: [https://www.ad-tokens.com](https://www.ad-tokens.com)
- **OpenAPI Spec**: [openapi.yaml](../../openapi.yaml)
- **Code Examples**: [../examples/](../examples/)

## Support

Need help? Contact us:
- Email: hello@ad-tokens.com
- GitHub Issues: [https://github.com/pa-arth/AdAPI/issues](https://github.com/pa-arth/AdAPI/issues)

