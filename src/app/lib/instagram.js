/**
 * Instagram API client with error handling and fallback to mock data
 */

// Import mock data for fallback
import { getMockConversations, getMockMessages, getMockProfile } from './client-mock-data';

/**
 * Error codes from Instagram API that indicate permission issues
 */
const PERMISSION_ERROR_CODES = [298, 10];

/**
 * Fetches Instagram profile information
 * @returns {Promise<Object>} Profile data
 */
export async function fetchInstagramProfile() {
  try {
    // Check if we should use real API or mock data
    const useRealApi = localStorage.getItem('useRealApi') === 'true';
    
    if (!useRealApi) {
      console.log('Using mock profile data (by user setting)');
      return { 
        data: getMockProfile(),
        is_mock: true,
        error: null
      };
    }
    
    const response = await fetch('/api/instagram/profile');
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error fetching Instagram profile:', data);
      
      // Check if this is a permission error
      const isPermissionError = data.error && 
        PERMISSION_ERROR_CODES.includes(data.error.code);
      
      if (isPermissionError) {
        console.warn('Permission error fetching Instagram profile, falling back to mock data');
        return { 
          data: getMockProfile(),
          is_mock: true,
          error: data.error
        };
      }
      
      throw new Error(data.error?.message || 'Failed to fetch Instagram profile');
    }
    
    return { 
      data: data,
      is_mock: false,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchInstagramProfile:', error);
    
    // Fallback to mock data on any error
    return { 
      data: getMockProfile(),
      is_mock: true,
      error: { message: error.message }
    };
  }
}

/**
 * Fetches Instagram conversations (DMs)
 * @returns {Promise<Object>} Conversations data
 */
export async function fetchInstagramConversations() {
  try {
    // Check if we should use real API or mock data
    const useRealApi = localStorage.getItem('useRealApi') === 'true';
    
    if (!useRealApi) {
      console.log('Using mock conversations data (by user setting)');
      return { 
        data: getMockConversations(),
        is_mock: true,
        error: null
      };
    }
    
    const response = await fetch('/api/instagram/conversations');
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error fetching Instagram conversations:', data);
      
      // Check if this is a permission error
      const isPermissionError = data.error && 
        PERMISSION_ERROR_CODES.includes(data.error.code);
      
      if (isPermissionError) {
        console.warn('Permission error fetching Instagram conversations, falling back to mock data');
        return { 
          data: getMockConversations(),
          is_mock: true,
          error: data.error
        };
      }
      
      throw new Error(data.error?.message || 'Failed to fetch Instagram conversations');
    }
    
    return { 
      data: data,
      is_mock: false,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchInstagramConversations:', error);
    
    // Fallback to mock data on any error
    return { 
      data: getMockConversations(),
      is_mock: true,
      error: { message: error.message }
    };
  }
}

/**
 * Fetches messages for a specific Instagram conversation
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<Object>} Messages data
 */
export async function fetchInstagramMessages(conversationId) {
  try {
    // Check if we should use real API or mock data
    const useRealApi = localStorage.getItem('useRealApi') === 'true';
    
    if (!useRealApi) {
      console.log('Using mock messages data (by user setting)');
      return { 
        data: getMockMessages(conversationId),
        is_mock: true,
        error: null
      };
    }
    
    const response = await fetch(`/api/instagram/conversations/${conversationId}`);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error fetching Instagram messages:', data);
      
      // Check if this is a permission error
      const isPermissionError = data.error && 
        PERMISSION_ERROR_CODES.includes(data.error.code);
      
      if (isPermissionError) {
        console.warn('Permission error fetching Instagram messages, falling back to mock data');
        return { 
          data: getMockMessages(conversationId),
          is_mock: true,
          error: data.error
        };
      }
      
      throw new Error(data.error?.message || 'Failed to fetch Instagram messages');
    }
    
    return { 
      data: data,
      is_mock: false,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchInstagramMessages:', error);
    
    // Fallback to mock data on any error
    return { 
      data: getMockMessages(conversationId),
      is_mock: true,
      error: { message: error.message }
    };
  }
}

/**
 * Sends a message to an Instagram conversation
 * @param {string} conversationId - ID of the conversation
 * @param {string} message - Message text to send
 * @returns {Promise<Object>} Result of the send operation
 */
export async function sendInstagramMessage(conversationId, message) {
  try {
    // Check if we should use real API or mock data
    const useRealApi = localStorage.getItem('useRealApi') === 'true';
    
    if (!useRealApi) {
      console.log('Using mock send message (by user setting)');
      return { 
        success: true,
        is_mock: true,
        error: null
      };
    }
    
    const response = await fetch('/api/instagram/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        message: message
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error sending Instagram message:', data);
      
      // Check if this is a permission error
      const isPermissionError = data.error && 
        PERMISSION_ERROR_CODES.includes(data.error.code);
      
      if (isPermissionError) {
        console.warn('Permission error sending Instagram message, returning mock success');
        return { 
          success: true,
          is_mock: true,
          error: data.error
        };
      }
      
      throw new Error(data.error?.message || 'Failed to send Instagram message');
    }
    
    return { 
      success: true,
      is_mock: false,
      error: null
    };
  } catch (error) {
    console.error('Error in sendInstagramMessage:', error);
    
    // Return mock success on any error
    return { 
      success: true,
      is_mock: true,
      error: { message: error.message }
    };
  }
}

/**
 * Checks if the Instagram API is available with the required permissions
 * @returns {Promise<Object>} API status information
 */
export async function checkInstagramApiStatus() {
  try {
    const profileResult = await fetchInstagramProfile();
    const conversationsResult = await fetchInstagramConversations();
    
    return {
      profile: {
        available: !profileResult.is_mock,
        error: profileResult.error
      },
      conversations: {
        available: !conversationsResult.is_mock,
        error: conversationsResult.error
      },
      hasReadMailboxPermission: !conversationsResult.is_mock,
      hasRequiredPermissions: !conversationsResult.is_mock
    };
  } catch (error) {
    console.error('Error checking Instagram API status:', error);
    
    return {
      profile: {
        available: false,
        error: { message: error.message }
      },
      conversations: {
        available: false,
        error: { message: error.message }
      },
      hasReadMailboxPermission: false,
      hasRequiredPermissions: false
    };
  }
}
