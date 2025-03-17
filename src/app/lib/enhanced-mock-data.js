/**
 * Enhanced mock data for Instagram DM dashboard
 * Provides realistic Japanese conversation data when API access fails
 */

// Generate a random date within the last 30 days
function randomRecentDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  
  return date.toISOString();
}

// Generate a random message ID
function generateMessageId() {
  return `msg_${Math.random().toString(36).substring(2, 15)}`;
}

// Generate a random conversation ID
function generateConversationId() {
  return `t_${Math.random().toString(36).substring(2, 15)}`;
}

// Japanese greetings and common phrases
const japaneseGreetings = [
  'こんにちは！',
  'はじめまして！',
  'お元気ですか？',
  'ご連絡ありがとうございます。',
  'お問い合わせいただきありがとうございます。',
  'いつもご利用ありがとうございます。',
  'よろしくお願いします。',
  'またのご連絡をお待ちしております。',
  'ご質問があればお気軽にどうぞ。',
  'お返事が遅くなり申し訳ありません。'
];

// Japanese business inquiries
const japaneseInquiries = [
  '商品の詳細について教えていただけますか？',
  '配送はどのくらいかかりますか？',
  '返品ポリシーについて知りたいです。',
  '在庫はありますか？',
  'サイズ交換は可能ですか？',
  '支払い方法を教えてください。',
  '割引コードはありますか？',
  'カスタマイズは可能ですか？',
  '法人向けのサービスはありますか？',
  '予約は必要ですか？'
];

// Japanese business responses
const japaneseResponses = [
  '商品の詳細は公式サイトでご確認いただけます。',
  '通常、配送は3〜5営業日以内に完了します。',
  '商品到着後14日以内であれば返品可能です。',
  '現在、全サイズ在庫がございます。',
  'サイズ交換は無料で承っております。',
  'クレジットカード、銀行振込、代金引換に対応しています。',
  '新規会員登録で10%割引コードをお送りしています。',
  'カスタマイズについては別途ご相談ください。',
  '法人向けの特別プランをご用意しております。',
  'ご予約は公式サイトから24時間受け付けております。'
];

// Japanese customer names
const japaneseCustomers = [
  { id: 'user_1', name: '田中さん' },
  { id: 'user_2', name: '佐藤さん' },
  { id: 'user_3', name: '鈴木さん' },
  { id: 'user_4', name: '高橋さん' },
  { id: 'user_5', name: '渡辺さん' },
  { id: 'user_6', name: '伊藤さん' },
  { id: 'user_7', name: '山本さん' },
  { id: 'user_8', name: '中村さん' },
  { id: 'user_9', name: '小林さん' },
  { id: 'user_10', name: '加藤さん' }
];

// Generate a realistic conversation with Japanese content
function generateJapaneseConversation(customerId, customerName) {
  const messageCount = 3 + Math.floor(Math.random() * 8); // 3-10 messages
  const messages = [];
  const isBusinessInquiry = Math.random() > 0.5;
  
  // First message is always from customer
  messages.push({
    id: generateMessageId(),
    from: {
      id: customerId,
      username: customerName
    },
    to: {
      id: 'business',
      username: 'ビジネスアカウント'
    },
    text: isBusinessInquiry 
      ? japaneseInquiries[Math.floor(Math.random() * japaneseInquiries.length)]
      : japaneseGreetings[Math.floor(Math.random() * japaneseGreetings.length)],
    timestamp: randomRecentDate()
  });
  
  // Generate the rest of the conversation
  for (let i = 1; i < messageCount; i++) {
    const isCustomer = i % 2 === 0;
    
    messages.push({
      id: generateMessageId(),
      from: {
        id: isCustomer ? customerId : 'business',
        username: isCustomer ? customerName : 'ビジネスアカウント'
      },
      to: {
        id: isCustomer ? 'business' : customerId,
        username: isCustomer ? 'ビジネスアカウント' : customerName
      },
      text: isCustomer 
        ? (Math.random() > 0.7 
            ? japaneseInquiries[Math.floor(Math.random() * japaneseInquiries.length)]
            : 'ありがとうございます。')
        : (isBusinessInquiry 
            ? japaneseResponses[Math.floor(Math.random() * japaneseResponses.length)]
            : japaneseGreetings[Math.floor(Math.random() * japaneseGreetings.length)]),
      timestamp: randomRecentDate()
    });
  }
  
  // Sort messages by timestamp
  messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return {
    id: generateConversationId(),
    participants: [
      {
        id: customerId,
        username: customerName
      },
      {
        id: 'business',
        username: 'ビジネスアカウント'
      }
    ],
    updated_time: messages[messages.length - 1].timestamp,
    messages: messages
  };
}

// Generate mock conversations for all customers
function generateAllConversations() {
  return japaneseCustomers.map(customer => 
    generateJapaneseConversation(customer.id, customer.name)
  );
}

// Generate customer profiles
function generateCustomerProfiles() {
  return japaneseCustomers.map(customer => ({
    id: customer.id,
    username: customer.name,
    profile_picture: `https://i.pravatar.cc/150?u=${customer.id}`,
    conversation_count: 1,
    last_active: randomRecentDate()
  }));
}

// Generate AI response suggestions for a conversation
function generateAIResponseSuggestions(conversation) {
  if (!conversation || !conversation.messages || conversation.messages.length === 0) {
    return [];
  }
  
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  
  // Only generate suggestions if the last message is from the customer
  if (lastMessage.from.id === 'business') {
    return [];
  }
  
  // Generate 3 different response suggestions
  return [
    {
      id: `ai_resp_1_${lastMessage.id}`,
      text: 'ご連絡ありがとうございます。詳細を確認させていただきます。',
      created_at: new Date().toISOString()
    },
    {
      id: `ai_resp_2_${lastMessage.id}`,
      text: 'お問い合わせいただきありがとうございます。担当者が確認次第、ご連絡いたします。',
      created_at: new Date().toISOString()
    },
    {
      id: `ai_resp_3_${lastMessage.id}`,
      text: 'ご質問ありがとうございます。カスタマーサポートがサポートいたします。',
      created_at: new Date().toISOString()
    }
  ];
}

// Export mock data functions
module.exports = {
  generateAllConversations,
  generateCustomerProfiles,
  generateAIResponseSuggestions,
  generateJapaneseConversation
};
