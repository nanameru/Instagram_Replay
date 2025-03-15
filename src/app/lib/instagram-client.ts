/**
 * Instagram API client functions
 * This file contains functions for interacting with the Instagram Graph API
 */

import { Customer, Conversation, Message } from '../types';

// Instagram Graph API base URL
const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
const API_VERSION = 'v18.0';

/**
 * Fetch Instagram profile information
 */
export async function fetchInstagramProfile(userId: string): Promise<Customer | null> {
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
    return {
      id: data.profile.id,
      name: data.profile.name || data.profile.username,
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
 */
export async function fetchInstagramMessages(conversationId: string): Promise<Message[]> {
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
