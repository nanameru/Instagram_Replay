import { Customer, Conversation, Message } from '../types';

/**
 * Fetch Instagram profile information
 */
export async function fetchInstagramProfile(userId: string): Promise<Customer | null> {
  try {
    const response = await fetch('/api/instagram/profile');
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.is_mock) {
      console.warn('Using mock profile data');
    }
    
    if (!data.profile) {
      return null;
    }
    
    return {
      id: data.profile.id,
      name: data.profile.name || data.profile.username || 'Unknown',
      username: data.profile.username,
      profile_picture_url: data.profile.profile_picture_url
    };
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return null;
  }
}

/**
 * Fetch Instagram conversations
 */
export async function fetchInstagramConversations(userId: string): Promise<Conversation[]> {
  try {
    const response = await fetch('/api/instagram/conversations');
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.is_mock) {
      console.warn('Using mock conversations data');
    }
    
    return data.conversations || [];
  } catch (error) {
    console.error('Error fetching Instagram conversations:', error);
    return [];
  }
}

/**
 * Fetch Instagram messages
 */
export async function fetchInstagramMessages(conversationId: string): Promise<Message[]> {
  try {
    const response = await fetch('/api/instagram/messages');
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.is_mock) {
      console.warn('Using mock messages data');
    }
    
    return data.messages || [];
  } catch (error) {
    console.error('Error fetching Instagram messages:', error);
    return [];
  }
}

/**
 * Send a message to an Instagram user
 */
export async function sendInstagramMessage(recipientId: string, message: string): Promise<any> {
  try {
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
      throw new Error(`Instagram API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending Instagram message:', error);
    throw error;
  }
}
