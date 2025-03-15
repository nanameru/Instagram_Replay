import { Customer, Conversation, Message } from '../types';

/**
 * Fetch Instagram profile information
 * @returns Customer object or null if error
 */
export async function fetchInstagramProfile(accessToken: string): Promise<Customer | null> {
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
      name: data.profile.name || 'Instagram User',
      username: data.profile.username,
      profile_picture_url: data.profile.profile_picture_url
    };
    
    return customer;
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return null;
  }
}

/**
 * Fetch Instagram conversations
 * @returns Array of Conversation objects
 */
export async function fetchInstagramConversations(accessToken: string): Promise<Conversation[]> {
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
    console.error('Error fetching Instagram conversations:', error);
    return [];
  }
}

/**
 * Fetch Instagram messages
 * @returns Array of Message objects
 */
export async function fetchInstagramMessages(accessToken: string): Promise<Message[]> {
  try {
    // Use server-side API route to protect access token
    const response = await fetch('/api/instagram/messages');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.is_mock) {
      console.warn('Using mock message data due to API limitations');
    }
    
    return data.messages || [];
  } catch (error) {
    console.error('Error fetching Instagram messages:', error);
    return [];
  }
}

/**
 * Send a message to an Instagram user
 * @param recipientId ID of the recipient
 * @param message Message text to send
 * @returns Response from the API
 */
export async function sendInstagramMessage(recipientId: string, message: string): Promise<any> {
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
    console.error('Error sending Instagram message:', error);
    throw error;
  }
}
