/**
 * Enhanced mock data generation for Instagram DM dashboard
 * Provides realistic Japanese conversation data as fallback when API access fails
 */

// Generate Japanese customer profiles
function generateCustomerProfiles() {
  return [
    {
      id: 'customer-1',
      username: 'tanaka_yuki',
      name: '田中 ゆき',
      profilePicture: 'https://randomuser.me/api/portraits/women/42.jpg',
      lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      unreadCount: 2
    },
    {
      id: 'customer-2',
      username: 'suzuki_takashi',
      name: '鈴木 たかし',
      profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      unreadCount: 0
    },
    {
      id: 'customer-3',
      username: 'yamada_hanako',
      name: '山田 はなこ',
      profilePicture: 'https://randomuser.me/api/portraits/women/22.jpg',
      lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      unreadCount: 1
    },
    {
      id: 'customer-4',
      username: 'sato_kenji',
      name: '佐藤 けんじ',
      profilePicture: 'https://randomuser.me/api/portraits/men/67.jpg',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      unreadCount: 0
    },
    {
      id: 'customer-5',
      username: 'nakamura_aiko',
      name: '中村 あいこ',
      profilePicture: 'https://randomuser.me/api/portraits/women/56.jpg',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      unreadCount: 3
    }
  ];
}

// Generate Japanese conversation for a specific customer
function generateJapaneseConversation(customerId, customerName) {
  const now = new Date();
  const conversations = {
    'customer-1': {
      id: `conversation-${customerId}`,
      customerId: customerId,
      customerName: customerName || '田中 ゆき',
      messages: [
        {
          id: `msg-${customerId}-1`,
          from: { id: customerId, name: customerName || '田中 ゆき' },
          content: 'こんにちは！商品について質問があります。',
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
          isRead: true
        },
        {
          id: `msg-${customerId}-2`,
          from: { id: 'business', name: 'ビジネスアカウント' },
          content: 'こんにちは！どのような質問でしょうか？',
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 1.9).toISOString(),
          isRead: true
        },
        {
          id: `msg-${customerId}-3`,
          from: { id: customerId, name: customerName || '田中 ゆき' },
          content: '新しい商品の在庫はありますか？',
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 1.8).toISOString(),
          isRead: true
        },
        {
          id: `msg-${customerId}-4`,
          from: { id: 'business', name: 'ビジネスアカウント' },
          content: '現在、新商品は入荷待ちです。来週入荷予定ですので、もうしばらくお待ちください。',
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 1.7).toISOString(),
          isRead: true
        },
        {
          id: `msg-${customerId}-5`,
          from: { id: customerId, name: customerName || '田中 ゆき' },
          content: 'わかりました。予約はできますか？',
          timestamp: new Date(now.getTime() - 1000 * 60 * 20).toISOString(),
          isRead: false
        },
        {
          id: `msg-${customerId}-6`,
          from: { id: customerId, name: customerName || '田中 ゆき' },
          content: 'あと、送料はいくらですか？',
          timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
          isRead: false
        }
      ]
    },
    // More conversations omitted for brevity
  };

  return conversations[customerId] || {
    id: `conversation-${customerId}`,
    customerId: customerId,
    customerName: customerName || 'お客様',
    messages: [
      {
        id: `msg-${customerId}-1`,
        from: { id: customerId, name: customerName || 'お客様' },
        content: 'こんにちは！',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
        isRead: true
      }
    ]
  };
}

// Generate all conversations
function generateAllConversations() {
  const customers = generateCustomerProfiles();
  return customers.map(customer => generateJapaneseConversation(customer.id, customer.name));
}

// Generate AI response suggestions
function generateAIResponseSuggestions(conversationId) {
  return [
    'ありがとうございます。他にご質問はございますか？',
    'ご連絡ありがとうございます。詳細を確認してご返信いたします。',
    'お問い合わせいただきありがとうございます。できる限り早くご対応いたします。'
  ];
}

module.exports = {
  generateCustomerProfiles,
  generateJapaneseConversation,
  generateAllConversations,
  generateAIResponseSuggestions
};
