# Authentication Guide

Ad-Tokens API supports two authentication methods depending on your use case.

## API Key Authentication (Recommended for Agents)

API keys are the recommended authentication method for AI agents, bots, and server-to-server integrations.

### Getting an API Key

1. Sign up at [https://www.ad-tokens.com](https://www.ad-tokens.com)
2. Navigate to API Keys in the dashboard
3. Click "Create API Key"
4. Copy the key (you'll only see it once!)

### Using API Keys

Include your API key in the `x-api-key` header:

```bash
curl -X POST https://api.ad-tokens.com/search \
  -H "x-api-key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{"query": "laptop"}'
```

### API Key Security Best Practices

1. **Never commit API keys to version control**
   - Use environment variables
   - Use secret management services (AWS Secrets Manager, HashiCorp Vault, etc.)

2. **Rotate keys regularly**
   - Use the key rotation endpoint: `POST /keys/{key_id}/rotate`
   - Revoke compromised keys immediately

3. **Use separate keys for different environments**
   - Development key for testing
   - Production key for live traffic
   - Staging key for staging environment

4. **Monitor key usage**
   - Check the dashboard for unusual activity
   - Set up alerts for rate limit violations

## JWT Bearer Token Authentication

JWT tokens are used for user-facing applications where you need to authenticate users via Supabase.

### Getting a JWT Token

JWT tokens are obtained from Supabase Auth. Users authenticate with Supabase, and you receive a JWT token.

### Using JWT Tokens

Include the JWT token in the `Authorization` header:

```bash
curl -X POST https://api.ad-tokens.com/search \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"query": "laptop"}'
```

### JWT Token Flow

1. User authenticates with Supabase (via your frontend)
2. Supabase returns a JWT token
3. Your frontend sends the JWT to your backend
4. Your backend includes the JWT in API requests

### JWT Security Best Practices

1. **Validate tokens on your backend**
   - Never trust client-side tokens without validation
   - Verify token signature and expiration

2. **Use HTTPS only**
   - JWT tokens should never be sent over HTTP
   - Enable HTTPS in production

3. **Handle token expiration**
   - Implement token refresh logic
   - Gracefully handle 401 Unauthorized responses

## Session Cookie Authentication

After logging in via `POST /auth/login`, the API sets an HttpOnly session cookie that's automatically sent with subsequent requests.

### Login Flow

```bash
# Login with JWT token
curl -X POST https://api.ad-tokens.com/auth/login \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"

# Session cookie is now set, subsequent requests don't need headers
curl -X GET https://api.ad-tokens.com/auth/me
```

### When to Use Session Cookies

- User-facing web applications
- Dashboard access
- Developer portal endpoints

## API Versioning

All requests should include the `API-Version` header:

```bash
curl -X POST https://api.ad-tokens.com/search \
  -H "x-api-key: your-api-key-here" \
  -H "API-Version: 2024-01-15" \
  -H "Content-Type: application/json" \
  -d '{"query": "laptop"}'
```

If omitted, the API defaults to the latest stable version. Header-based versioning allows cleaner URLs and easier version management.

## Error Responses

### 401 Unauthorized

```json
{
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing API key."
}
```

**Common causes:**
- Missing or incorrect API key
- Expired JWT token
- Invalid JWT signature

### 403 Forbidden

```json
{
  "code": "FORBIDDEN",
  "message": "API key does not have permission to access this resource."
}
```

**Common causes:**
- API key is revoked
- Insufficient permissions for the requested resource

## Rate Limiting

Rate limits are enforced per API key. Check response headers:

- `X-RateLimit-Limit`: Total requests allowed per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### 429 Rate Limit Exceeded

```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Please try again later."
}
```

**Solutions:**
- Wait for the reset time (check `X-RateLimit-Reset` header)
- Implement exponential backoff
- Upgrade your plan for higher limits

## Security Checklist

- [ ] API keys stored in environment variables
- [ ] API keys never committed to version control
- [ ] HTTPS enabled in production
- [ ] JWT tokens validated on backend
- [ ] Rate limiting implemented
- [ ] Error handling for authentication failures
- [ ] Key rotation schedule in place
- [ ] Monitoring for suspicious activity

## Next Steps

- Read the [Search Guide](search-guide.md) to start making requests
- Check out [Best Practices](best-practices.md) for production security
- Review [Code Examples](../examples/) for implementation patterns

