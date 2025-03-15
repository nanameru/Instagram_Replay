/**
 * Client-side mock data for Instagram DM dashboard
 * This file provides mock data when real API calls fail or when in mock mode
 */

import { Customer, Conversation, Message, AIResponse } from '../types';

// Mock customers
const mockCustomers: Customer[] = [
  {
    id: 'customer1',
    name: '田中 太郎',
    username: 'taro_tanaka',
    profile_picture_url: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 'customer2',
    name: '佐藤 花子',
    username: 'hanako_sato',
    profile_picture_url: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 'customer3',
    name: '鈴木 一郎',
    username: 'ichiro_suzuki',
    profile_picture_url: 'https://randomuser.me/api/portraits/men/2.jpg'
  }
];

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    customer_id: 'customer1',
    customer_name: '田中 太郎',
    last_message: '商品の在庫はありますか？',
    last_message_time: new Date(Date.now() - 3600000).toISOString(),
    unread_count: 2
  },
  {
    id: 'conv2',
    customer_id: 'customer2',
    customer_name: '佐藤 花子',
    last_message: 'ありがとうございます！',
    last_message_time: new Date(Date.now() - 86400000).toISOString(),
    unread_count: 0
  },
  {
    id: 'conv3',
    customer_id: 'customer3',
    customer_name: '鈴木 一郎',
    last_message: '配送状況を教えてください。',
    last_message_time: new Date(Date.now() - 172800000).toISOString(),
    unread_count: 1
  }
];

// Mock messages
const mockMessages: Record<string, Message[]> = {
  'conv1': [
    {
      id: 'msg1',
      sender_id: 'customer1',
      recipient_id: 'business',
      text: 'こんにちは、新商品について質問があります。',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      is_from_instagram: true
    },
    {
      id: 'msg2',
      sender_id: 'business',
      recipient_id: 'customer1',
      text: 'こんにちは！どのような質問でしょうか？',
      timestamp: new Date(Date.now() - 7000000).toISOString(),
      is_from_instagram: false
    },
    {
      id: 'msg3',
      sender_id: 'customer1',
      recipient_id: 'business',
      text: '新しいモデルの価格を教えてください。',
      timestamp: new Date(Date.now() - 6800000).toISOString(),
      is_from_instagram: true
    },
    {
      id: 'msg4',
      sender_id: 'business',
      recipient_id: 'customer1',
      text: '新モデルは12,800円です。今なら送料無料キャンペーン中です！',
      timestamp: new Date(Date.now() - 6600000).toISOString(),
      is_from_instagram: false
    },
    {
      id: 'msg5',
      sender_id: 'customer1',
      recipient_id: 'business',
      text: '商品の在庫はありますか？',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      is_from_instagram: true
    }
  ],
  'conv2': [
    {
      id: 'msg6',
      sender_id: 'customer2',
      recipient_id: 'business',
      text: '先日注文した商品の配送状況を教えてください。',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      is_from_instagram: true
    },
    {
      id: 'msg7',
      sender_id: 'business',
      recipient_id: 'customer2',
      text: 'お問い合わせありがとうございます。注文番号をお知らせいただけますか？',
      timestamp: new Date(Date.now() - 172700000).toISOString(),
      is_from_instagram: false
    },
    {
      id: 'msg8',
      sender_id: 'customer2',
      recipient_id: 'business',
      text: '注文番号はORD-12345です。',
      timestamp: new Date(Date.now() - 172600000).toISOString(),
      is_from_instagram: true
    },
    {
      id: 'msg9',
      sender_id: 'business',
      recipient_id: 'customer2',
      text: '確認しました。明日到着予定です。',
      timestamp: new Date(Date.now() - 172500000).toISOString(),
      is_from_instagram: false
    },
    {
      id: 'msg10',
      sender_id: 'customer2',
      recipient_id: 'business',
      text: 'ありがとうございます！',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      is_from_instagram: true
    }
  ],
  'conv3': [
    {
      id: 'msg11',
      sender_id: 'customer3',
      recipient_id: 'business',
      text: '返品の手続きについて教えてください。',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      is_from_instagram: true
    },
    {
      id: 'msg12',
      sender_id: 'business',
      recipient_id: 'customer3',
      text: '返品については、商品到着後7日以内であれば承ります。詳細はウェブサイトの返品ポリシーをご確認ください。',
      timestamp: new Date(Date.now() - 259100000).toISOString(),
      is_from_instagram: false
    },
    {
      id: 'msg13',
      sender_id: 'customer3',
      recipient_id: 'business',
      text: 'わかりました。返品フォームはどこにありますか？',
      timestamp: new Date(Date.now() - 259000000).toISOString(),
      is_from_instagram: true
    },
    {
      id: 'msg14',
      sender_id: 'business',
      recipient_id: 'customer3',
      text: 'マイページの注文履歴から該当の商品を選択し、「返品申請」ボタンをクリックしてください。',
      timestamp: new Date(Date.now() - 258900000).toISOString(),
      is_from_instagram: false
    },
    {
      id: 'msg15',
      sender_id: 'customer3',
      recipient_id: 'business',
      text: '配送状況を教えてください。',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      is_from_instagram: true
    }
  ]
};

// Mock AI responses
const mockAIResponses: Record<string, AIResponse[]> = {
  'conv1': [
    {
      conversation_id: 'conv1',
      message_id: 'msg1',
      original_message: 'こんにちは、新商品について質問があります。',
      suggested_response: 'こんにちは！新商品についてのご質問ありがとうございます。どのような点についてお知りになりたいですか？',
      created_at: new Date(Date.now() - 7100000).toISOString()
    },
    {
      conversation_id: 'conv1',
      message_id: 'msg3',
      original_message: '新しいモデルの価格を教えてください。',
      suggested_response: '新しいモデルの価格は12,800円（税込）です。現在、期間限定で送料無料キャンペーンを実施しております。ご検討いただければ幸いです。',
      created_at: new Date(Date.now() - 6700000).toISOString()
    },
    {
      conversation_id: 'conv1',
      message_id: 'msg5',
      original_message: '商品の在庫はありますか？',
      suggested_response: 'はい、現在在庫がございます。ご注文いただければ、通常1〜2営業日以内に発送させていただきます。何か他にご質問はございますか？',
      created_at: new Date(Date.now() - 3500000).toISOString()
    }
  ],
  'conv2': [
    {
      conversation_id: 'conv2',
      message_id: 'msg6',
      original_message: '先日注文した商品の配送状況を教えてください。',
      suggested_response: 'お問い合わせありがとうございます。配送状況を確認するために、お手数ですが注文番号をお知らせいただけますか？',
      created_at: new Date(Date.now() - 172750000).toISOString()
    },
    {
      conversation_id: 'conv2',
      message_id: 'msg8',
      original_message: '注文番号はORD-12345です。',
      suggested_response: 'ORD-12345のご注文を確認いたしました。現在配送中で、明日到着予定となっております。何かご不明な点がございましたら、お気軽にお問い合わせください。',
      created_at: new Date(Date.now() - 172550000).toISOString()
    }
  ],
  'conv3': [
    {
      conversation_id: 'conv3',
      message_id: 'msg11',
      original_message: '返品の手続きについて教えてください。',
      suggested_response: '返品手続きについてのお問い合わせありがとうございます。当店では商品到着後7日以内であれば、未使用・未開封の商品に限り返品を承っております。詳細な手続きについては、当店ウェブサイトの返品ポリシーページをご確認ください。',
      created_at: new Date(Date.now() - 259150000).toISOString()
    },
    {
      conversation_id: 'conv3',
      message_id: 'msg13',
      original_message: 'わかりました。返品フォームはどこにありますか？',
      suggested_response: '返品フォームは、当店ウェブサイトのマイページにログイン後、注文履歴から該当の商品を選択し、「返品申請」ボタンをクリックしていただくとアクセスできます。ご不明な点がございましたら、お気軽にお問い合わせください。',
      created_at: new Date(Date.now() - 258950000).toISOString()
    },
    {
      conversation_id: 'conv3',
      message_id: 'msg15',
      original_message: '配送状況を教えてください。',
      suggested_response: '配送状況についてのお問い合わせありがとうございます。ご注文番号をお知らせいただければ、現在の配送状況を確認させていただきます。',
      created_at: new Date(Date.now() - 172750000).toISOString()
    }
  ]
};

// Get all customers
export function getAllCustomers(): Customer[] {
  return mockCustomers;
}

// Get a specific customer by ID
export function getCustomer(id: string): Customer | null {
  return mockCustomers.find(customer => customer.id === id) || null;
}

// Get all conversations
export function getAllConversations(): Conversation[] {
  return mockConversations;
}

// Get a specific conversation by ID
export function getConversation(id: string): Conversation | null {
  return mockConversations.find(conversation => conversation.id === id) || null;
}

// Get messages for a specific conversation
export function getMessagesByConversation(conversationId: string): Message[] {
  return mockMessages[conversationId] || [];
}

// Get AI responses for a specific conversation
export function getAIResponsesByConversation(conversationId: string): AIResponse[] {
  return mockAIResponses[conversationId] || [];
}

// Get the latest AI response for a specific conversation
export function getLatestAIResponse(conversationId: string): AIResponse | null {
  const responses = mockAIResponses[conversationId] || [];
  if (responses.length === 0) return null;
  
  // Sort by created_at in descending order and return the first one
  return [...responses].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
}

// Generate an AI response for a message
export function generateAIResponseForMessage(
  conversationId: string, 
  messageId: string, 
  messageText: string
): AIResponse {
  const response: AIResponse = {
    conversation_id: conversationId,
    message_id: messageId,
    original_message: messageText,
    suggested_response: generateMockResponse(messageText),
    created_at: new Date().toISOString()
  };
  
  return response;
}

// Helper function to generate a mock response based on the message text
function generateMockResponse(messageText: string): string {
  if (messageText.includes('価格') || messageText.includes('料金') || messageText.includes('いくら')) {
    return '商品の価格は12,800円（税込）です。現在、期間限定で送料無料キャンペーンを実施しております。';
  } else if (messageText.includes('在庫') || messageText.includes('あります')) {
    return 'はい、現在在庫がございます。ご注文いただければ、通常1〜2営業日以内に発送させていただきます。';
  } else if (messageText.includes('配送') || messageText.includes('届く') || messageText.includes('到着')) {
    return 'ご注文いただいた商品は、通常1〜2営業日以内に発送し、発送後2〜3日程度でお届けいたします。具体的な配送状況については、注文番号をお知らせいただければ確認いたします。';
  } else if (messageText.includes('返品') || messageText.includes('交換')) {
    return '返品・交換は商品到着後7日以内であれば承ります。未使用・未開封の商品に限りますので、ご了承ください。詳細は当店ウェブサイトの返品ポリシーをご確認ください。';
  } else if (messageText.includes('質問') || messageText.includes('教えて')) {
    return 'ご質問ありがとうございます。どのような点についてお知りになりたいですか？商品の詳細、配送、返品ポリシーなど、お気軽にお問い合わせください。';
  } else {
    return 'お問い合わせありがとうございます。どのようなことでお手伝いできますか？商品に関するご質問、ご注文状況の確認など、お気軽にお知らせください。';
  }
}

// Generate mock data for testing
export function generateClientMockData(
  numCustomers: number = 5, 
  maxMessagesPerConversation: number = 10
): {
  customers: Customer[];
  conversations: Conversation[];
  message: string;
} {
  // For simplicity, we'll just return the existing mock data
  return {
    customers: mockCustomers,
    conversations: mockConversations,
    message: `モックデータが生成されました。${mockCustomers.length}人の顧客と${mockConversations.length}件の会話が含まれています。`
  };
}
