/**
 * Enhanced API endpoint for retrieving historical Instagram DMs (TypeScript version)
 * Includes robust token validation, permission checking, and fallback to mock data
 * With multiple API access approaches to handle different account configurations
 */

import { NextRequest, NextResponse } from 'next/server';
const { generateJapaneseConversation } = require('../../../lib/enhanced-mock-data');

// Define interfaces for type safety
interface MessageSender {
  id: string;
  name: string;
}

interface Message {
  id: string;
  from: MessageSender;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Paging {
  previous: string | null;
  next: string | null;
}

interface ErrorInfo {
  error: string;
  code: number | string;
  details?: any;
  message?: string;
  renewal_guide?: string | null;
}

interface ApiResponse {
  messages?: Message[];
  conversations?: any[];
  paging: Paging;
  is_mock_data: boolean;
  error?: ErrorInfo;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversation_id');
    const before = url.searchParams.get('before');
    const after = url.searchParams.get('after');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Check if this is a mock conversation ID (starts with 'conv_')
    if (conversationId && conversationId.startsWith('conv_')) {
      return NextResponse.json(handleMockConversation(conversationId, before, after, limit));
    }
    
    // Get access token from environment or request header
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || 
                       request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      console.log('No access token provided, falling back to mock data');
      return NextResponse.json(handleMockConversation(conversationId, before, after, limit, {
        error: 'アクセストークンが必要です',
        code: 'NO_TOKEN'
      }));
    }
    
    // Validate token and check if it's expired
    const tokenValidation = await validateToken(accessToken);
    
    if (!tokenValidation.isValid) {
      // Check if token is expired
      const isExpired = tokenValidation.error?.code === 190;
      
      // Return mock data with specific error for expired token
      return NextResponse.json(handleMockConversation(conversationId, before, after, limit, {
        error: isExpired 
          ? 'アクセストークンが期限切れです。新しいトークンを取得するか、設定ページでトークンを更新してください。' 
          : tokenValidation.error?.message || 'トークンが無効です。',
        code: tokenValidation.error?.code || 400,
        renewal_guide: isExpired ? '/settings/token-renewal' : null
      }));
    }
    
    // Get user info first instead of directly trying to access Facebook pages
    const meResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!meResponse.ok) {
      const errorData = await meResponse.json();
      console.log('Error getting user info:', errorData);
      return NextResponse.json(handleMockConversation(conversationId, before, after, limit, {
        error: 'ユーザー情報の取得に失敗しました。',
        code: errorData.error?.code || 500,
        details: errorData
      }));
    }
    
    const meData = await meResponse.json();
    const userId = meData.id;
    
    // Try multiple approaches to get Instagram business account
    let igBusinessAccountId: string | null = null;
    let pageAccessToken: string = accessToken;
    let errorDetails: any = null;
    
    // Approach 1: Try to get Instagram business account directly
    try {
      const igBusinessResponse = await fetch(
        `https://graph.facebook.com/v18.0/${userId}/instagram_business_account?access_token=${accessToken}`,
        { method: 'GET' }
      );
      
      if (igBusinessResponse.ok) {
        const igBusinessData = await igBusinessResponse.json();
        if (igBusinessData.data && igBusinessData.data.length > 0) {
          igBusinessAccountId = igBusinessData.data[0].id;
          console.log('Found Instagram business account using direct approach:', igBusinessAccountId);
        }
      } else {
        const error = await igBusinessResponse.json();
        console.log('Direct approach failed:', error);
        errorDetails = error;
      }
    } catch (error) {
      console.log('Error in direct approach:', error);
    }
    
    // Approach 2: Try older API version to get Facebook pages
    if (!igBusinessAccountId) {
      try {
        const apiVersions = ['v17.0', 'v16.0', 'v15.0', 'v14.0'];
        
        for (const version of apiVersions) {
          const pagesResponse = await fetch(
            `https://graph.facebook.com/${version}/me/accounts?access_token=${accessToken}`,
            { method: 'GET' }
          );
          
          if (pagesResponse.ok) {
            const pagesData = await pagesResponse.json();
            
            if (pagesData.data && pagesData.data.length > 0) {
              const pageId = pagesData.data[0].id;
              pageAccessToken = pagesData.data[0].access_token || accessToken;
              
              const igAccountResponse = await fetch(
                `https://graph.facebook.com/${version}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`,
                { method: 'GET' }
              );
              
              if (igAccountResponse.ok) {
                const igAccountData = await igAccountResponse.json();
                
                if (igAccountData.instagram_business_account) {
                  igBusinessAccountId = igAccountData.instagram_business_account.id;
                  console.log('Found Instagram business account using API version', version, ':', igBusinessAccountId);
                  break;
                }
              }
            }
          }
        }
      } catch (error) {
        console.log('Error in older API version approach:', error);
      }
    }
    
    // Approach 3: Try alternative endpoints
    if (!igBusinessAccountId) {
      try {
        const instagramAccountsResponse = await fetch(
          `https://graph.facebook.com/v18.0/me/instagram_accounts?access_token=${accessToken}`,
          { method: 'GET' }
        );
        
        if (instagramAccountsResponse.ok) {
          const instagramAccountsData = await instagramAccountsResponse.json();
          
          if (instagramAccountsData.data && instagramAccountsData.data.length > 0) {
            igBusinessAccountId = instagramAccountsData.data[0].id;
            console.log('Found Instagram account using instagram_accounts endpoint:', igBusinessAccountId);
          }
        } else {
          const error = await instagramAccountsResponse.json();
          console.log('Instagram accounts approach failed:', error);
          errorDetails = errorDetails || error;
        }
      } catch (error) {
        console.log('Error in instagram_accounts approach:', error);
      }
    }
    
    // If we still don't have an Instagram business account ID, fall back to mock data
    if (!igBusinessAccountId) {
      console.log('Could not find Instagram business account, falling back to mock data');
      return NextResponse.json(handleMockConversation(conversationId, before, after, limit, {
        error: 'Instagramビジネスアカウントが見つかりません。ビジネスアカウントを設定してください。',
        code: 'NO_IG_ACCOUNT',
        details: errorDetails
      }));
    }
    
    // Now we have an Instagram business account ID, we can proceed with getting conversations/messages
    
    // Try to get historical messages
    let apiUrl = `https://graph.facebook.com/v18.0/${igBusinessAccountId}/conversations`;
    
    // If no specific conversation ID is provided, get all conversations first
    if (!conversationId) {
      const conversationsResponse = await fetch(
        `${apiUrl}?access_token=${pageAccessToken}&limit=${limit}`,
        { method: 'GET' }
      );
      
      if (!conversationsResponse.ok) {
        const errorData = await conversationsResponse.json();
        console.log('Error getting conversations:', errorData);
        
        // Check if this is a permission error (code 298)
        if (errorData.error?.code === 298) {
          return NextResponse.json(handleMockConversation(conversationId, before, after, limit, {
            error: '必要な権限がありません。instagram_manage_messages権限が必要です。',
            code: 298,
            details: errorData
          }));
        }
        
        return NextResponse.json(handleMockConversation(conversationId, before, after, limit, {
          error: '会話リストの取得に失敗しました。',
          code: errorData.error?.code || 500,
          details: errorData
        }));
      }
      
      const conversationsData = await conversationsResponse.json();
      
      // Return list of conversations
      return NextResponse.json({
        conversations: conversationsData.data,
        paging: conversationsData.paging,
        is_mock_data: false
      });
    }
    
    // If a specific conversation ID is provided, get messages for that conversation
    apiUrl = `https://graph.facebook.com/v18.0/${conversationId}/messages?access_token=${pageAccessToken}&limit=${limit}`;
    
    if (before) {
      apiUrl += `&before=${before}`;
    } else if (after) {
      apiUrl += `&after=${after}`;
    }
    
    const messagesResponse = await fetch(apiUrl, { method: 'GET' });
    
    if (!messagesResponse.ok) {
      const errorData = await messagesResponse.json();
      console.log('Error getting messages:', errorData);
      
      // Check if this is a permission error (code 298)
      if (errorData.error?.code === 298) {
        return NextResponse.json(handleMockConversation(conversationId, before, after, limit, {
          error: '必要な権限がありません。read_mailbox権限が必要です。',
          code: 298,
          details: errorData
        }));
      }
      
      return NextResponse.json(handleMockConversation(conversationId, before, after, limit, {
        error: 'メッセージの取得に失敗しました。',
        code: errorData.error?.code || 500,
        details: errorData
      }));
    }
    
    const messagesData = await messagesResponse.json();
    
    // Format the response
    const formattedMessages: Message[] = messagesData.data.map((message: any) => ({
      id: message.id,
      from: {
        id: message.from.id,
        name: message.from.name
      },
      content: message.message,
      timestamp: message.created_time,
      isRead: true
    }));
    
    // Add pagination links
    const paging: Paging = {
      previous: messagesData.paging?.previous ? `?conversation_id=${conversationId}&before=${messagesData.paging.cursors.before}` : null,
      next: messagesData.paging?.next ? `?conversation_id=${conversationId}&after=${messagesData.paging.cursors.after}` : null
    };
    
    return NextResponse.json({
      messages: formattedMessages,
      paging,
      is_mock_data: false
    });
    
  } catch (error: any) {
    console.error('Unhandled error in historical-messages API:', error);
    return NextResponse.json(handleMockConversation(null, null, null, 20, {
      error: '予期せぬエラーが発生しました。',
      code: 'UNHANDLED_ERROR',
      message: error.message
    }));
  }
}

// Helper function to validate token
async function validateToken(token: string): Promise<{ isValid: boolean; error?: { code: number; message: string } }> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`,
      { method: 'GET' }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        isValid: false, 
        error: { 
          code: response.status, 
          message: data.error?.message || 'トークンの検証に失敗しました' 
        } 
      };
    }
    
    if (!data.data || !data.data.is_valid) {
      // Check if this is an expired token (code 190)
      if (data.error?.code === 190 || (data.data && data.data.error && data.data.error.code === 190)) {
        return { 
          isValid: false, 
          error: { 
            code: 190, 
            message: 'アクセストークンが期限切れです' 
          } 
        };
      }
      
      return { 
        isValid: false, 
        error: { 
          code: data.error?.code || 400, 
          message: data.error?.message || 'トークンが無効です' 
        } 
      };
    }
    
    return { isValid: true };
  } catch (error: any) {
    console.error('Error validating token:', error);
    return { 
      isValid: false, 
      error: { 
        code: 500, 
        message: error.message || 'トークン検証中にエラーが発生しました' 
      } 
    };
  }
}

// Helper function to handle mock conversation
function handleMockConversation(
  conversationId: string | null, 
  before: string | null, 
  after: string | null, 
  limit: number, 
  errorInfo: ErrorInfo | null = null
): ApiResponse {
  // Generate mock conversation data
  const mockConversation = generateJapaneseConversation(conversationId || 'customer-1');
  const allMessages: Message[] = mockConversation.messages;
  
  // Sort messages by timestamp (newest first)
  allMessages.sort((a: Message, b: Message) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Implement pagination
  let startIndex = 0;
  if (after) {
    const afterIndex = allMessages.findIndex(msg => msg.id === after);
    startIndex = afterIndex !== -1 ? afterIndex + 1 : 0;
  } else if (before) {
    const beforeIndex = allMessages.findIndex(msg => msg.id === before);
    startIndex = beforeIndex !== -1 ? Math.max(0, beforeIndex - limit) : 0;
  }
  
  const endIndex = Math.min(startIndex + limit, allMessages.length);
  const paginatedMessages = allMessages.slice(startIndex, endIndex);
  
  // Add pagination links
  const paging: Paging = {
    previous: startIndex > 0 && paginatedMessages.length > 0 ? 
      `?conversation_id=${conversationId}&before=${paginatedMessages[0].id}` : null,
    next: endIndex < allMessages.length && paginatedMessages.length > 0 ? 
      `?conversation_id=${conversationId}&after=${paginatedMessages[paginatedMessages.length - 1].id}` : null
  };
  
  const response: ApiResponse = {
    messages: paginatedMessages,
    paging,
    is_mock_data: true
  };
  
  // Add error info if provided
  if (errorInfo) {
    response.error = errorInfo;
    
    // Add renewal guide link for expired tokens
    if (errorInfo.code === 190) {
      response.error.renewal_guide = '/settings/token-renewal';
    }
  }
  
  return response;
}
