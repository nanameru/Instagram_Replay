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

// Client-side API functions that use the mock data directly
// This avoids using API routes which can cause issues with static exports

export async function fetchCustomers(): Promise<Customer[]> {
  console.log('Fetching customers from client-side mock data');
  return getAllCustomers();
}

export async function fetchCustomer(id: string): Promise<Customer | null> {
  console.log(`Fetching customer ${id} from client-side mock data`);
  return getCustomer(id);
}

export async function fetchConversations(): Promise<Conversation[]> {
  console.log('Fetching conversations from client-side mock data');
  return getAllConversations();
}

export async function fetchConversation(id: string): Promise<Conversation | null> {
  console.log(`Fetching conversation ${id} from client-side mock data`);
  return getConversation(id);
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  console.log(`Fetching messages for conversation ${conversationId} from client-side mock data`);
  return getMessagesByConversation(conversationId);
}

export async function fetchAIResponses(conversationId: string): Promise<AIResponse[]> {
  console.log(`Fetching AI responses for conversation ${conversationId} from client-side mock data`);
  return getAIResponsesByConversation(conversationId);
}

export async function fetchLatestAIResponse(conversationId: string): Promise<AIResponse | null> {
  console.log(`Fetching latest AI response for conversation ${conversationId} from client-side mock data`);
  return getLatestAIResponse(conversationId);
}

export async function generateAIResponse(
  conversationId: string, 
  messageId: string, 
  messageText: string
): Promise<AIResponse> {
  console.log(`Generating AI response for message ${messageId} in conversation ${conversationId}`);
  return generateAIResponseForMessage(conversationId, messageId, messageText);
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
