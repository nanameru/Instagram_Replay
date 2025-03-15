import { Customer, Conversation, Message, AIResponse } from '../types';
import { 
  getAllCustomers, 
  getCustomer, 
  getAllConversations, 
  getConversation,
  getMessagesByConversation,
  getAIResponsesByConversation,
  getLatestAIResponse,
  generateClientMockData,
  generateAIResponseForMessage
} from './client-mock-data';

// Flag to determine whether to use real API or mock data
const USE_REAL_API = typeof window !== 'undefined' && localStorage.getItem('useRealApi') === 'true';

export async function fetchCustomers(): Promise<Customer[]> {
  if (USE_REAL_API) {
    console.log('Fetching customers from Instagram API');
    try {
      // Use server-side API route to protect access token
      const response = await fetch('/api/instagram/profile');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.is_mock) {
        console.warn('Using mock profile data due to API limitations');
      }
      
      if (!data.profile) {
        return [];
      }
      
      // Transform to Customer type
      const customer: Customer = {
        id: data.profile.id,
        name: data.profile.name || data.profile.username,
        username: data.profile.username,
        profile_picture_url: data.profile.profile_picture_url
      };
      
      return [customer];
    } catch (error) {
      console.error('Error fetching customers from Instagram API:', error);
      // Fall back to mock data if API fails
      return getAllCustomers();
    }
  } else {
    console.log('Fetching customers from client-side mock data');
    return getAllCustomers();
  }
}

export async function fetchCustomer(id: string): Promise<Customer | null> {
  if (USE_REAL_API) {
    console.log(`Fetching customer ${id} from Instagram API`);
    try {
      // Use server-side API route to protect access token
      const response = await fetch('/api/instagram/profile');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.is_mock) {
        console.warn('Using mock profile data due to API limitations');
      }
      
      if (!data.profile) {
        return null;
      }
      
      // Transform to Customer type
      const customer: Customer = {
        id: data.profile.id,
        name: data.profile.name || data.profile.username,
        username: data.profile.username,
        profile_picture_url: data.profile.profile_picture_url
      };
      
      return customer.id === id ? customer : null;
    } catch (error) {
      console.error(`Error fetching customer ${id} from Instagram API:`, error);
      // Fall back to mock data if API fails
      return getCustomer(id);
    }
  } else {
    console.log(`Fetching customer ${id} from client-side mock data`);
    return getCustomer(id);
  }
}

export async function fetchConversations(): Promise<Conversation[]> {
  if (USE_REAL_API) {
    console.log('Fetching conversations from Instagram API');
    try {
      // Use server-side API route to protect access token
      const response = await fetch('/api/instagram/conversations');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.is_mock) {
        console.warn('Using mock conversation data due to API limitations');
      }
      
      return data.conversations || [];
    } catch (error) {
      console.error('Error fetching conversations from Instagram API:', error);
      // Fall back to mock data if API fails
      return getAllConversations();
    }
  } else {
    console.log('Fetching conversations from client-side mock data');
    return getAllConversations();
  }
}

export async function fetchConversation(id: string): Promise<Conversation | null> {
  if (USE_REAL_API) {
    console.log(`Fetching conversation ${id} from Instagram API`);
    try {
      // Fetch all conversations and find the one with the matching ID
      const conversations = await fetchConversations();
      return conversations.find(conv => conv.id === id) || null;
    } catch (error) {
      console.error(`Error fetching conversation ${id} from Instagram API:`, error);
      // Fall back to mock data if API fails
      return getConversation(id);
    }
  } else {
    console.log(`Fetching conversation ${id} from client-side mock data`);
    return getConversation(id);
  }
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  if (USE_REAL_API) {
    console.log(`Fetching messages for conversation ${conversationId} from Instagram API`);
    try {
      // Use server-side API route to protect access token
      const response = await fetch(`/api/instagram/conversations/${conversationId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.is_mock) {
        console.warn('Using mock message data due to API limitations');
      }
      
      return data.messages || [];
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId} from Instagram API:`, error);
      // Fall back to mock data if API fails
      return getMessagesByConversation(conversationId);
    }
  } else {
    console.log(`Fetching messages for conversation ${conversationId} from client-side mock data`);
    return getMessagesByConversation(conversationId);
  }
}

export async function fetchAIResponses(conversationId: string): Promise<AIResponse[]> {
  if (USE_REAL_API) {
    console.log(`Fetching AI responses for conversation ${conversationId} from API`);
    try {
      // Use API route for AI responses
      const response = await fetch(`/api/conversations/${conversationId}/ai-responses`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.responses || [];
    } catch (error) {
      console.error(`Error fetching AI responses for conversation ${conversationId}:`, error);
      // Fall back to mock data if API fails
      return getAIResponsesByConversation(conversationId);
    }
  } else {
    console.log(`Fetching AI responses for conversation ${conversationId} from client-side mock data`);
    return getAIResponsesByConversation(conversationId);
  }
}

export async function fetchLatestAIResponse(conversationId: string): Promise<AIResponse | null> {
  if (USE_REAL_API) {
    console.log(`Fetching latest AI response for conversation ${conversationId} from API`);
    try {
      // Use API route for latest AI response
      const response = await fetch(`/api/conversations/${conversationId}/latest-ai-response`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.response || null;
    } catch (error) {
      console.error(`Error fetching latest AI response for conversation ${conversationId}:`, error);
      // Fall back to mock data if API fails
      return getLatestAIResponse(conversationId);
    }
  } else {
    console.log(`Fetching latest AI response for conversation ${conversationId} from client-side mock data`);
    return getLatestAIResponse(conversationId);
  }
}

export async function generateAIResponse(
  conversationId: string, 
  messageId: string, 
  messageText: string
): Promise<AIResponse> {
  if (USE_REAL_API) {
    console.log(`Generating AI response for message ${messageId} in conversation ${conversationId} using API`);
    try {
      // Use API route for generating AI response
      const response = await fetch(`/api/conversations/${conversationId}/generate-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_id: messageId,
          message_text: messageText,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error generating AI response:`, error);
      // Fall back to mock data if API fails
      return generateAIResponseForMessage(conversationId, messageId, messageText);
    }
  } else {
    console.log(`Generating AI response for message ${messageId} in conversation ${conversationId}`);
    return generateAIResponseForMessage(conversationId, messageId, messageText);
  }
}

export async function generateMockData(
  numCustomers: number = 5, 
  maxMessagesPerConversation: number = 10
): Promise<{
  customers: Customer[];
  conversations: Conversation[];
  message: string;
}> {
  console.log(`Generating mock data with ${numCustomers} customers and up to ${maxMessagesPerConversation} messages per conversation`);
  return generateClientMockData(numCustomers, maxMessagesPerConversation);
}

/**
 * Send a message to an Instagram user
 */
export async function sendMessage(
  conversationId: string,
  recipientId: string,
  message: string
): Promise<any> {
  if (USE_REAL_API) {
    console.log(`Sending message to ${recipientId} in conversation ${conversationId} using API`);
    try {
      // Use server-side API route to protect access token
      const response = await fetch('/api/instagram/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_id: recipientId,
          message: message,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  } else {
    console.log(`Simulating sending message to ${recipientId} in conversation ${conversationId}`);
    // In mock mode, we just return a success response
    return { success: true, message: 'Message sent (mock)' };
  }
}

/**
 * Toggle between real API and mock data
 */
export function toggleUseRealApi(useRealApi: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('useRealApi', useRealApi ? 'true' : 'false');
    // Reload the page to apply the change
    window.location.reload();
  }
}

/**
 * Check if real API is being used
 */
export function isUsingRealApi(): boolean {
  return USE_REAL_API;
}
