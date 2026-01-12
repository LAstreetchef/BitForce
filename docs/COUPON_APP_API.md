# Coupon App API Integration Guide

This document explains how external applications can integrate with the BitForce ambassador portal to sync customer data and share personalized coupon books.

## Overview

The Coupon App API allows authorized external applications to:
- Authenticate ambassadors via OAuth2-style flow
- Retrieve customer contacts with incremental sync support
- Access lead data for coupon targeting
- Share personalized coupon books with customers

## Base URL

```
Production: https://your-domain.replit.app
Development: http://localhost:5000
```

## Prerequisites

### Ambassador Onboarding Requirement

Before an ambassador can use this API, they must complete the BitForce onboarding process:

1. **Sign up** as a BitForce ambassador at the portal
2. **Complete the 3-step onboarding wizard:**
   - Step 1: Personal Information (full name)
   - Step 2: Contact Details (email, phone, optional referral code)
   - Step 3: Terms & Agreement (must accept terms of service)
3. **Onboarding must be fully completed** before API tokens can be issued

If an ambassador has not completed onboarding, token requests will fail with a 403 error:

```json
{
  "error": "Ambassador has not completed onboarding. Please complete the onboarding process in the BitForce portal before using the API."
}
```

---

## Authentication

### Step 1: Obtain API Key

Contact BitForce administration to receive your `COUPON_APP_API_KEY`. This key must be included in all API requests via the `X-API-Key` header.

### Step 2: Request Access Token

Exchange ambassador credentials for a bearer token.

**Endpoint:** `POST /api/auth/token`

**Headers:**
```
Content-Type: application/json
X-API-Key: your-api-key
```

**Request Body (using ambassador ID):**
```json
{
  "grant_type": "client_credentials",
  "ambassador_id": "ambassador-user-id"
}
```

**Request Body (using email - recommended):**
```json
{
  "grant_type": "client_credentials",
  "email": "ambassador@example.com"
}
```

**Response (200 OK):**
```json
{
  "access_token": "abc123def456...",
  "refresh_token": "xyz789ghi012...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read:customers read:leads write:coupon-books",
  "ambassador_id": "ambassador-user-id"
}
```

**Error Responses:**
- 400: `{ "error": "ambassador_id or email required for client_credentials grant" }`
- 404: `{ "error": "Ambassador not found" }`

**Note:** You can provide either `ambassador_id` or `email`. If both are provided, `email` takes precedence.

### Step 3: Refresh Token

When your access token expires, use the refresh token to get a new one.

**Request Body:**
```json
{
  "grant_type": "refresh_token",
  "refresh_token": "xyz789ghi012..."
}
```

**Response:** Same format as token request.

### Step 4: Use Bearer Token

Include the access token in all subsequent API requests:

```
Authorization: Bearer abc123def456...
X-API-Key: your-api-key
```

## Endpoints

### Verify Token

Check if a token is still valid.

**Endpoint:** `POST /api/auth/verify-token`

**Headers:**
```
Content-Type: application/json
X-API-Key: your-api-key
```

**Request Body:**
```json
{
  "access_token": "abc123def456..."
}
```

**Response (200 OK) - Valid:**
```json
{
  "valid": true,
  "ambassador_id": "ambassador-user-id",
  "scope": "read:customers read:leads write:coupon-books",
  "expires_at": "2026-01-12T13:00:00.000Z"
}
```

**Response (200 OK) - Invalid:**
```json
{
  "valid": false,
  "reason": "Token expired"
}
```

---

### Get User Info

Retrieve ambassador profile information.

**Endpoint:** `GET /api/auth/user-info`

**Headers:**
```
Authorization: Bearer abc123def456...
X-API-Key: your-api-key
```

**Response (200 OK):**
```json
{
  "id": "ambassador-user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "subscription_status": "active",
  "referral_code": "JOHN123"
}
```

---

### Get Customers

Retrieve paginated list of ambassador's customer contacts.

**Endpoint:** `GET /api/v1/customers`

**Headers:**
```
Authorization: Bearer abc123def456...
X-API-Key: your-api-key
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 50 | Number of records per page (max: 100) |
| `offset` | integer | 0 | Number of records to skip |
| `updated_since` | string | - | ISO 8601 date for incremental sync |

**Example Request:**
```
GET /api/v1/customers?limit=25&offset=0&updated_since=2026-01-01T00:00:00Z
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "555-123-4567",
      "zipCode": null,
      "demographics": {
        "age": null,
        "income": null,
        "interests": []
      },
      "createdAt": "2026-01-10T14:30:00.000Z",
      "updatedAt": "2026-01-10T14:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 25,
    "offset": 0,
    "hasMore": true
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid updated_since format. Use ISO 8601 date format."
}
```

---

### Get Leads

Retrieve paginated list of all leads in the system.

**Endpoint:** `GET /api/v1/leads`

**Headers:**
```
Authorization: Bearer abc123def456...
X-API-Key: your-api-key
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 50 | Number of records per page (max: 100) |
| `offset` | integer | 0 | Number of records to skip |
| `updated_since` | string | - | ISO 8601 date for incremental sync |

**Example Request:**
```
GET /api/v1/leads?limit=50&updated_since=2026-01-11T00:00:00Z
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "phone": "555-987-6543",
      "zipCode": "77002",
      "demographics": {
        "age": null,
        "income": null,
        "interests": ["Home security", "Smart thermostats"]
      },
      "createdAt": "2026-01-11T09:15:00.000Z",
      "updatedAt": "2026-01-11T09:15:00.000Z"
    }
  ],
  "pagination": {
    "total": 500,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### Share Coupon Book

Share a personalized coupon book with a customer or lead.

**Endpoint:** `POST /api/v1/coupon-books/share`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer abc123def456...
X-API-Key: your-api-key
```

**Request Body:**
```json
{
  "customerId": 1,
  "title": "Summer Savings 2026",
  "coupons": [
    {
      "id": "coupon-001",
      "title": "20% Off Smart Thermostat",
      "description": "Save on Nest or Ecobee installation",
      "discount": "20%",
      "expiresAt": "2026-03-31T23:59:59Z"
    },
    {
      "id": "coupon-002",
      "title": "$50 Off Security System",
      "description": "Professional installation included",
      "discount": "$50",
      "expiresAt": "2026-03-31T23:59:59Z"
    }
  ],
  "totalSavings": "$150+",
  "shareVia": "email"
}
```

**Required Fields:**
- `customerId` OR `leadId` (at least one required)
- `title` (string, min 1 character)
- `coupons` (array of coupon objects)
- `shareVia` ("email" or "sms")

**Coupon Object Fields:**
- `id` (string, required)
- `title` (string, required)
- `description` (string, optional)
- `discount` (string, required)
- `expiresAt` (string, optional ISO 8601 date)

**Response (201 Created):**
```json
{
  "id": 1,
  "status": "pending",
  "sharedAt": "2026-01-12T10:30:00.000Z",
  "message": "Coupon book queued for delivery via email"
}
```

**Error Responses:**
- 400: `{ "error": "Either customerId or leadId is required" }`
- 400: `{ "error": "Invalid request body", "details": [...] }`

---

## Incremental Sync

To efficiently sync data, use the `updated_since` parameter:

1. Store the timestamp of your last successful sync
2. On subsequent requests, pass this timestamp
3. Only records created/updated after this time are returned
4. The `pagination.total` reflects only filtered records

**Example Sync Flow:**
```javascript
// Initial sync - get all records
let allCustomers = [];
let offset = 0;
let hasMore = true;

while (hasMore) {
  const response = await fetch(`/api/v1/customers?limit=100&offset=${offset}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-API-Key': apiKey
    }
  });
  const { data, pagination } = await response.json();
  allCustomers = allCustomers.concat(data);
  hasMore = pagination.hasMore;
  offset += 100;
}

// Store sync timestamp
const lastSync = new Date().toISOString();

// Later: incremental sync (only new/updated records)
const updates = await fetch(
  `/api/v1/customers?updated_since=${encodeURIComponent(lastSync)}`,
  { headers: { 'Authorization': `Bearer ${accessToken}`, 'X-API-Key': apiKey } }
);
```

---

## Rate Limiting

- **Limit:** 100 requests per minute per ambassador
- **Headers returned on every response:**
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: Unix timestamp when window resets

**Response (429 Too Many Requests):**
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 45
}
```

The `retryAfter` value is the number of seconds until you can make requests again.

---

## CORS Configuration

By default, CORS is configured to allow requests from any origin (`*`). To restrict to your app's domain, set the `COUPON_APP_ORIGIN` environment variable on the BitForce server.

**Allowed Methods:** GET, POST, OPTIONS
**Allowed Headers:** Content-Type, Authorization, X-API-Key

---

## Error Codes

| HTTP Code | Error | Description |
|-----------|-------|-------------|
| 400 | Bad Request | Invalid parameters, missing required fields, or invalid date format |
| 401 | Unauthorized | Missing/invalid API key, missing/invalid/expired token |
| 403 | Forbidden | Ambassador has not completed onboarding |
| 404 | Not Found | Ambassador or resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## Code Examples

### JavaScript/Node.js

```javascript
const COUPON_API_KEY = process.env.COUPON_APP_API_KEY;
const BASE_URL = 'https://your-domain.replit.app';

class CouponAppClient {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.accessToken = null;
    this.refreshToken = null;
  }

  async getAccessToken(ambassadorId) {
    const response = await fetch(`${this.baseUrl}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        ambassador_id: ambassadorId
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get access token');
    }
    
    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    return data;
  }

  async refreshAccessToken() {
    const response = await fetch(`${this.baseUrl}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    return data;
  }

  async getCustomers(limit = 50, offset = 0, updatedSince = null) {
    let url = `${this.baseUrl}/api/v1/customers?limit=${limit}&offset=${offset}`;
    if (updatedSince) {
      url += `&updated_since=${encodeURIComponent(updatedSince)}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'X-API-Key': this.apiKey
      }
    });
    
    if (response.status === 429) {
      const error = await response.json();
      throw new Error(`Rate limited. Retry in ${error.retryAfter} seconds`);
    }
    
    return response.json();
  }

  async getLeads(limit = 50, offset = 0, updatedSince = null) {
    let url = `${this.baseUrl}/api/v1/leads?limit=${limit}&offset=${offset}`;
    if (updatedSince) {
      url += `&updated_since=${encodeURIComponent(updatedSince)}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'X-API-Key': this.apiKey
      }
    });
    
    return response.json();
  }

  async shareCouponBook(customerId, leadId, title, coupons, shareVia, totalSavings = null) {
    const body = {
      title,
      coupons,
      shareVia
    };
    
    if (customerId) body.customerId = customerId;
    if (leadId) body.leadId = leadId;
    if (totalSavings) body.totalSavings = totalSavings;
    
    const response = await fetch(`${this.baseUrl}/api/v1/coupon-books/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify(body)
    });
    
    return response.json();
  }

  async getAllCustomers() {
    const allCustomers = [];
    let offset = 0;
    let hasMore = true;
    
    while (hasMore) {
      const { data, pagination } = await this.getCustomers(100, offset);
      allCustomers.push(...data);
      hasMore = pagination.hasMore;
      offset += 100;
    }
    
    return allCustomers;
  }
}

// Usage
async function main() {
  const client = new CouponAppClient(COUPON_API_KEY, BASE_URL);
  
  // Authenticate
  await client.getAccessToken('ambassador-123');
  
  // Get all customers
  const customers = await client.getAllCustomers();
  console.log(`Synced ${customers.length} customers`);
  
  // Share a coupon book
  const result = await client.shareCouponBook(
    customers[0].id,
    null,
    'Welcome Savings',
    [
      {
        id: 'welcome-001',
        title: '15% Off First Purchase',
        discount: '15%',
        expiresAt: '2026-02-28T23:59:59Z'
      }
    ],
    'email',
    '15%'
  );
  console.log('Coupon book shared:', result);
}

main().catch(console.error);
```

### Python

```python
import requests
import os
from typing import Optional, List, Dict, Any
from datetime import datetime

class CouponAppClient:
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self.access_token = None
        self.refresh_token = None

    def get_access_token(self, ambassador_id: str) -> dict:
        response = requests.post(
            f'{self.base_url}/api/auth/token',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': self.api_key
            },
            json={
                'grant_type': 'client_credentials',
                'ambassador_id': ambassador_id
            }
        )
        response.raise_for_status()
        data = response.json()
        self.access_token = data['access_token']
        self.refresh_token = data['refresh_token']
        return data

    def refresh_access_token(self) -> dict:
        response = requests.post(
            f'{self.base_url}/api/auth/token',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': self.api_key
            },
            json={
                'grant_type': 'refresh_token',
                'refresh_token': self.refresh_token
            }
        )
        response.raise_for_status()
        data = response.json()
        self.access_token = data['access_token']
        self.refresh_token = data['refresh_token']
        return data

    def verify_token(self, token: str) -> dict:
        response = requests.post(
            f'{self.base_url}/api/auth/verify-token',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': self.api_key
            },
            json={'access_token': token}
        )
        response.raise_for_status()
        return response.json()

    def get_customers(
        self,
        limit: int = 50,
        offset: int = 0,
        updated_since: Optional[str] = None
    ) -> dict:
        params = {'limit': limit, 'offset': offset}
        if updated_since:
            params['updated_since'] = updated_since

        response = requests.get(
            f'{self.base_url}/api/v1/customers',
            headers={
                'Authorization': f'Bearer {self.access_token}',
                'X-API-Key': self.api_key
            },
            params=params
        )
        
        if response.status_code == 429:
            error = response.json()
            raise Exception(f"Rate limited. Retry in {error['retryAfter']} seconds")
        
        response.raise_for_status()
        return response.json()

    def get_leads(
        self,
        limit: int = 50,
        offset: int = 0,
        updated_since: Optional[str] = None
    ) -> dict:
        params = {'limit': limit, 'offset': offset}
        if updated_since:
            params['updated_since'] = updated_since

        response = requests.get(
            f'{self.base_url}/api/v1/leads',
            headers={
                'Authorization': f'Bearer {self.access_token}',
                'X-API-Key': self.api_key
            },
            params=params
        )
        response.raise_for_status()
        return response.json()

    def share_coupon_book(
        self,
        title: str,
        coupons: List[Dict[str, Any]],
        share_via: str,
        customer_id: Optional[int] = None,
        lead_id: Optional[int] = None,
        total_savings: Optional[str] = None
    ) -> dict:
        body = {
            'title': title,
            'coupons': coupons,
            'shareVia': share_via
        }
        
        if customer_id:
            body['customerId'] = customer_id
        if lead_id:
            body['leadId'] = lead_id
        if total_savings:
            body['totalSavings'] = total_savings

        response = requests.post(
            f'{self.base_url}/api/v1/coupon-books/share',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.access_token}',
                'X-API-Key': self.api_key
            },
            json=body
        )
        response.raise_for_status()
        return response.json()

    def get_all_customers(self) -> List[dict]:
        all_customers = []
        offset = 0
        has_more = True

        while has_more:
            result = self.get_customers(limit=100, offset=offset)
            all_customers.extend(result['data'])
            has_more = result['pagination']['hasMore']
            offset += 100

        return all_customers


# Usage
if __name__ == '__main__':
    API_KEY = os.environ.get('COUPON_APP_API_KEY')
    BASE_URL = 'https://your-domain.replit.app'
    
    client = CouponAppClient(API_KEY, BASE_URL)
    
    # Authenticate
    client.get_access_token('ambassador-123')
    
    # Get all customers
    customers = client.get_all_customers()
    print(f"Synced {len(customers)} customers")
    
    # Share a coupon book
    if customers:
        result = client.share_coupon_book(
            title='Welcome Savings',
            coupons=[
                {
                    'id': 'welcome-001',
                    'title': '15% Off First Purchase',
                    'discount': '15%',
                    'expiresAt': '2026-02-28T23:59:59Z'
                }
            ],
            share_via='email',
            customer_id=customers[0]['id'],
            total_savings='15%'
        )
        print('Coupon book shared:', result)
```

---

## Support

For API access, technical support, or to report issues, contact the BitForce development team.
