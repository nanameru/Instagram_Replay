# Instagram API Integration Documentation

## Overview

This document provides information on how to integrate the Instagram Graph API with the Instagram DM Dashboard application. The integration allows the application to fetch direct messages from Instagram and display them in the dashboard.

## API Endpoints

### Instagram Graph API

The Instagram Graph API is used to access Instagram data. For direct messages, we need to use the Facebook Graph API with the Instagram Business Account ID.

#### Base URLs:
- Instagram Graph API: `https://graph.instagram.com`
- Facebook Graph API: `https://graph.facebook.com`

#### Key Endpoints:

1. **Profile Information**:
   ```
   GET https://graph.instagram.com/me?fields=id,username&access_token=YOUR_ACCESS_TOKEN
   ```

2. **Conversations/Direct Messages**:
   ```
   GET https://graph.facebook.com/v18.0/me/conversations?fields=participants,messages{from,message,created_time}&access_token=YOUR_ACCESS_TOKEN
   ```

3. **Send Message**:
   ```
   POST https://graph.facebook.com/v18.0/me/messages
   ```
   Body:
   ```json
   {
     "recipient": {"id": "RECIPIENT_ID"},
     "message": {"text": "Hello, world!"},
     "access_token": "YOUR_ACCESS_TOKEN"
   }
   ```

## Authentication

### Access Tokens

Instagram API requires access tokens for authentication. There are different types of tokens:

1. **User Access Token**: For accessing a specific user's data
2. **Page Access Token**: For accessing a Facebook Page's Instagram account
3. **App Access Token**: For app-level operations

For this application, we use a User Access Token with the appropriate permissions.

### Token Permissions

For DM functionality, the token needs the following permissions:
- `instagram_basic`: To access basic profile information
- `instagram_manage_messages`: To access and send direct messages

### Token Security

- Never expose access tokens in client-side code
- Store tokens securely on the server
- Use environment variables for token storage
- Implement token refresh mechanisms for long-lived tokens

## Implementation

### Server-Side API Routes

To protect access tokens, all Instagram API calls should be made from server-side API routes:

1. `/api/instagram/messages`: Fetch Instagram direct messages
2. `/api/instagram/profile`: Fetch Instagram profile information
3. `/api/instagram/webhook`: Handle Instagram webhook events for real-time updates

### Client-Side Integration

The client-side code should call these server-side API routes rather than directly accessing the Instagram API:

```typescript
// Example: Fetch Instagram messages
async function fetchInstagramMessages() {
  const response = await fetch('/api/instagram/messages');
  const data = await response.json();
  return data.messages;
}
```

## Webhooks

For real-time updates, Instagram provides webhooks that notify your application when events occur (e.g., new messages).

### Setting Up Webhooks:

1. Configure a webhook endpoint in your application (e.g., `/api/instagram/webhook`)
2. Register this endpoint with Instagram in the Facebook Developer Portal
3. Implement verification logic for the webhook subscription
4. Process webhook events to update your application state

## Testing

For testing purposes, you can use:

1. **Mock Data**: Simulate Instagram API responses for development
2. **Test Users**: Create test users in the Facebook Developer Portal
3. **Sandbox Mode**: Test your integration in a sandbox environment before going live

## Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- [Facebook Graph API Documentation](https://developers.facebook.com/docs/graph-api/)
- [Instagram Messaging Documentation](https://developers.facebook.com/docs/messenger-platform/instagram)
