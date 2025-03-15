export interface Customer {
  id: string;
  name: string;
  username?: string;
  profile_picture_url?: string;
}

export interface Conversation {
  id: string;
  customer_id: string;
  customer_name: string;
  messages?: string[];
  last_message_time?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  text: string;
  timestamp: string;
  is_from_instagram: boolean;
}

export interface AIResponse {
  conversation_id: string;
  message_id: string;
  original_message: string;
  suggested_response: string;
  created_at: string;
}
