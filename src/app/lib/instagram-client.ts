/**
 * Instagram API client for frontend use
 * This file contains functions to interact with the Instagram API through our server-side API routes
 */

import { Customer, Conversation, Message } from '../types';

/**
 * Fetch Instagram profile information
 */
export async function fetchInstagramProfile(userId: string): Promise<Customer | null> {
  try {
    const response = await fetch('/api/instagram/profile');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.profile) {
      // Transform the profile data to match our Customer type
      return {
        id: data.profile.id,
        name: data.profile.name,
        username: data.profile.username,
        profile_picture_url: data.profile.profile_picture_url
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    throw error;
  }
}

/**
 * Fetch Instagram conversations
 */
export async function fetchInstagramConversations(userId: string): Promise<Conversation[]> {
  try {
    const response = await fetch('/api/instagram/conversations');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.conversations && Array.isArray(data.conversations)) {
      return data.conversations;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Instagram conversations:', error);
    throw error;
  }
}

/**
 * Fetch Instagram messages
 */
export async function fetchInstagramMessages(conversationId: string): Promise<Message[]> {
  try {
    const response = await fetch(`/api/instagram/messages`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.messages && Array.isArray(data.messages)) {
      return data.messages;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Instagram messages:', error);
    throw error;
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
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending Instagram message:', error);
    throw error;
  }
}
