import { v4 as uuidv4 } from 'uuid';
import { Customer, Conversation, Message, AIResponse } from '../types';

// In-memory storage for client-side mock data
let customers: Record<string, Customer> = {};
let conversations: Record<string, Conversation> = {};
let messages: Message[] = [];
let aiResponses: AIResponse[] = [];

// Initialize with some default data if running in browser
if (typeof window !== 'undefined') {
  // Check if we already have data
  if (Object.keys(customers).length === 0) {
    console.log('Initializing default mock data');
    generateClientMockData(3, 5);
  }
}

// Export these for direct access in components
export const mockData = {
  get customers() { return Object.values(customers); },
  get conversations() { return Object.values(conversations); },
  get messages() { return messages; },
  get aiResponses() { return aiResponses; }
};

export function generateClientMockData(numCustomers = 5, maxMessagesPerConversation = 10) {
  // Reset data
  customers = {};
  conversations = {};
  messages = [];
  aiResponses = [];
  
  // Create customers
  const customerNames = ["田中太郎", "佐藤花子", "鈴木一郎", "高橋美咲", "伊藤健太"];
  const customerUsernames = ["tanaka_taro", "sato_hanako", "suzuki_ichiro", "takahashi_misaki", "ito_kenta"];
  const mockCustomerIds: string[] = [];
  const mockConversationIds: string[] = [];
  
  for (let i = 0; i < numCustomers; i++) {
    const customerId = uuidv4();
    const customerName = customerNames[i % customerNames.length];
    const username = customerUsernames[i % customerUsernames.length];
    
    // Add customer
    customers[customerId] = {
      id: customerId,
      name: customerName,
      username: username,
      profile_picture_url: `https://placekitten.com/200/200?image=${i}`
    };
    
    mockCustomerIds.push(customerId);
    
    // Create conversation for this customer
    const conversationId = uuidv4();
    conversations[conversationId] = {
      id: conversationId,
      customer_id: customerId,
      customer_name: customerName,
      messages: [],
      last_message_time: new Date().toISOString()
    };
    
    mockConversationIds.push(conversationId);
    
    // Generate messages
    const numMessages = Math.floor(Math.random() * maxMessagesPerConversation) + 3;
    
    for (let j = 0; j < numMessages; j++) {
      const isFromInstagram = j % 2 === 0;
      const messageId = uuidv4();
      const messageTime = new Date(Date.now() - (numMessages - j) * 3600000);
      
      // Sample Japanese messages
      const customerMessages = [
        "商品について質問があります。",
        "この商品はいつ入荷予定ですか？",
        "送料はいくらですか？",
        "返品は可能ですか？",
        "他の色はありますか？"
      ];
      
      const businessMessages = [
        "はい、喜んでお手伝いします。どのような質問ですか？",
        "来週入荷予定です。",
        "5000円以上のご購入で送料無料です。",
        "はい、商品到着後7日以内であれば返品可能です。",
        "現在、赤、青、黒の3色をご用意しております。"
      ];
      
      const messageText = isFromInstagram 
        ? customerMessages[j % customerMessages.length] 
        : businessMessages[j % businessMessages.length];
      
      const message = {
        id: messageId,
        sender_id: isFromInstagram ? customerId : 'business',
        recipient_id: isFromInstagram ? 'business' : customerId,
        text: messageText,
        timestamp: messageTime.toISOString(),
        is_from_instagram: isFromInstagram
      };
      
      messages.push(message);
      
      // Update conversation's last message time
      if (j === numMessages - 1) {
        conversations[conversationId].last_message_time = message.timestamp;
      }
      
      // Generate AI response for customer messages
      if (isFromInstagram) {
        const aiResponseTexts = [
          "はい、喜んでお手伝いします。どのような商品についてですか？",
          "商品は来週水曜日に入荷予定です。ご予約も承っております。",
          "5000円以上のご購入で送料無料となります。それ以下の場合は地域によって異なりますが、500円〜800円です。",
          "はい、商品到着後7日以内であれば、未使用の状態で返品可能です。返品送料はお客様負担となります。",
          "現在、赤、青、黒の3色をご用意しております。サイズはS、M、Lがございます。"
        ];
        
        const aiResponse = {
          conversation_id: conversationId,
          message_id: messageId,
          original_message: message.text,
          suggested_response: aiResponseTexts[j % aiResponseTexts.length],
          created_at: new Date(messageTime.getTime() + 300000).toISOString()
        };
        
        aiResponses.push(aiResponse);
      }
    }
  }
  
  return {
    customers: Object.values(customers),
    conversations: Object.values(conversations),
    message: `Generated ${numCustomers} customers with conversations`
  };
}

// Client-side data access methods
export function getAllCustomers(): Customer[] {
  return Object.values(customers);
}

export function getCustomer(id: string): Customer | null {
  return customers[id] || null;
}

export function getAllConversations(): Conversation[] {
  return Object.values(conversations);
}

export function getConversation(id: string): Conversation | null {
  return conversations[id] || null;
}

export function getMessagesByConversation(conversationId: string): Message[] {
  const conversation = conversations[conversationId];
  if (!conversation) return [];
  
  return messages.filter(
    m => 
      (m.sender_id === conversation.customer_id || m.recipient_id === conversation.customer_id)
  );
}

export function getAIResponsesByConversation(conversationId: string): AIResponse[] {
  return aiResponses.filter(r => r.conversation_id === conversationId);
}

export function getLatestAIResponse(conversationId: string): AIResponse | null {
  const responses = getAIResponsesByConversation(conversationId);
  if (responses.length === 0) return null;
  
  return responses.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
}

export function generateAIResponseForMessage(conversationId: string, messageId: string, messageText: string): AIResponse {
  const aiResponseTexts = [
    "はい、喜んでお手伝いします。どのような商品についてですか？",
    "商品は来週水曜日に入荷予定です。ご予約も承っております。",
    "5000円以上のご購入で送料無料となります。それ以下の場合は地域によって異なりますが、500円〜800円です。",
    "はい、商品到着後7日以内であれば、未使用の状態で返品可能です。返品送料はお客様負担となります。",
    "現在、赤、青、黒の3色をご用意しております。サイズはS、M、Lがございます。"
  ];
  
  const randomIndex = Math.floor(Math.random() * aiResponseTexts.length);
  
  const aiResponse = {
    conversation_id: conversationId,
    message_id: messageId,
    original_message: messageText,
    suggested_response: aiResponseTexts[randomIndex],
    created_at: new Date().toISOString()
  };
  
  aiResponses.push(aiResponse);
  return aiResponse;
}
