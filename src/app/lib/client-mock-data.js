/**
 * Mock data for Instagram API client fallback
 */

/**
 * Mock Instagram profile data
 * @returns {Object} Mock profile
 */
export function getMockProfile() {
  return {
    id: '975355974713289',
    name: '住宅四天王 エース',
    username: 'jutaku_shitenno_ace',
    profile_picture_url: 'https://randomuser.me/api/portraits/men/32.jpg'
  };
}

/**
 * Mock Instagram conversations data
 * @returns {Array} Mock conversations
 */
export function getMockConversations() {
  return [
    {
      id: 'conv_1001',
      participants: [
        {
          id: '1001',
          name: '田中 健太',
          profile_picture_url: 'https://randomuser.me/api/portraits/men/42.jpg'
        }
      ],
      updated_time: '2025-03-14T10:23:45Z',
      unread_count: 2,
      last_message: {
        from: {
          id: '1001',
          name: '田中 健太'
        },
        message: '新しい物件について質問があります。',
        created_time: '2025-03-14T10:23:45Z'
      }
    },
    {
      id: 'conv_1002',
      participants: [
        {
          id: '1002',
          name: '佐藤 美咲',
          profile_picture_url: 'https://randomuser.me/api/portraits/women/22.jpg'
        }
      ],
      updated_time: '2025-03-13T15:42:18Z',
      unread_count: 0,
      last_message: {
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: 'ご質問ありがとうございます。詳細をお送りしました。',
        created_time: '2025-03-13T15:42:18Z'
      }
    },
    {
      id: 'conv_1003',
      participants: [
        {
          id: '1003',
          name: '鈴木 大輔',
          profile_picture_url: 'https://randomuser.me/api/portraits/men/55.jpg'
        }
      ],
      updated_time: '2025-03-12T09:15:30Z',
      unread_count: 1,
      last_message: {
        from: {
          id: '1003',
          name: '鈴木 大輔'
        },
        message: '内見の日程を変更したいのですが可能でしょうか？',
        created_time: '2025-03-12T09:15:30Z'
      }
    },
    {
      id: 'conv_1004',
      participants: [
        {
          id: '1004',
          name: '山田 優子',
          profile_picture_url: 'https://randomuser.me/api/portraits/women/32.jpg'
        }
      ],
      updated_time: '2025-03-10T14:22:05Z',
      unread_count: 0,
      last_message: {
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: 'ご契約おめでとうございます！今後ともよろしくお願いいたします。',
        created_time: '2025-03-10T14:22:05Z'
      }
    },
    {
      id: 'conv_1005',
      participants: [
        {
          id: '1005',
          name: '伊藤 直樹',
          profile_picture_url: 'https://randomuser.me/api/portraits/men/67.jpg'
        }
      ],
      updated_time: '2025-03-08T11:33:42Z',
      unread_count: 0,
      last_message: {
        from: {
          id: '1005',
          name: '伊藤 直樹'
        },
        message: 'ありがとうございました。検討してみます。',
        created_time: '2025-03-08T11:33:42Z'
      }
    }
  ];
}

/**
 * Mock Instagram messages for a specific conversation
 * @param {string} conversationId - ID of the conversation
 * @returns {Array} Mock messages
 */
export function getMockMessages(conversationId) {
  const mockMessagesMap = {
    'conv_1001': [
      {
        id: 'msg_1001_1',
        from: {
          id: '1001',
          name: '田中 健太'
        },
        message: 'こんにちは、新しい物件について質問があります。',
        created_time: '2025-03-14T10:20:12Z'
      },
      {
        id: 'msg_1001_2',
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: 'こんにちは、田中様。どのような質問でしょうか？',
        created_time: '2025-03-14T10:21:30Z'
      },
      {
        id: 'msg_1001_3',
        from: {
          id: '1001',
          name: '田中 健太'
        },
        message: '青山の新築マンションの駐車場は何台まで契約できますか？',
        created_time: '2025-03-14T10:22:45Z'
      },
      {
        id: 'msg_1001_4',
        from: {
          id: '1001',
          name: '田中 健太'
        },
        message: 'また、ペットは飼育可能でしょうか？',
        created_time: '2025-03-14T10:23:45Z'
      }
    ],
    'conv_1002': [
      {
        id: 'msg_1002_1',
        from: {
          id: '1002',
          name: '佐藤 美咲'
        },
        message: '渋谷区の物件の資料をいただけますか？',
        created_time: '2025-03-13T15:30:22Z'
      },
      {
        id: 'msg_1002_2',
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: '佐藤様、お問い合わせありがとうございます。渋谷区のどのあたりをお探しでしょうか？',
        created_time: '2025-03-13T15:35:10Z'
      },
      {
        id: 'msg_1002_3',
        from: {
          id: '1002',
          name: '佐藤 美咲'
        },
        message: '代官山あたりで、2LDK以上の物件を探しています。予算は月15万円程度です。',
        created_time: '2025-03-13T15:40:05Z'
      },
      {
        id: 'msg_1002_4',
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: 'ご質問ありがとうございます。詳細をお送りしました。',
        created_time: '2025-03-13T15:42:18Z'
      }
    ],
    'conv_1003': [
      {
        id: 'msg_1003_1',
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: '鈴木様、明日の13時に目黒の物件の内見でお待ちしております。',
        created_time: '2025-03-11T16:10:33Z'
      },
      {
        id: 'msg_1003_2',
        from: {
          id: '1003',
          name: '鈴木 大輔'
        },
        message: 'ありがとうございます。楽しみにしています。',
        created_time: '2025-03-11T16:15:20Z'
      },
      {
        id: 'msg_1003_3',
        from: {
          id: '1003',
          name: '鈴木 大輔'
        },
        message: '内見の日程を変更したいのですが可能でしょうか？',
        created_time: '2025-03-12T09:15:30Z'
      }
    ],
    'conv_1004': [
      {
        id: 'msg_1004_1',
        from: {
          id: '1004',
          name: '山田 優子'
        },
        message: '契約書の内容を確認しました。問題ありません。',
        created_time: '2025-03-10T14:10:15Z'
      },
      {
        id: 'msg_1004_2',
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: '山田様、ご確認ありがとうございます。それでは手続きを進めさせていただきます。',
        created_time: '2025-03-10T14:15:42Z'
      },
      {
        id: 'msg_1004_3',
        from: {
          id: '1004',
          name: '山田 優子'
        },
        message: 'よろしくお願いします。入居が楽しみです。',
        created_time: '2025-03-10T14:20:30Z'
      },
      {
        id: 'msg_1004_4',
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: 'ご契約おめでとうございます！今後ともよろしくお願いいたします。',
        created_time: '2025-03-10T14:22:05Z'
      }
    ],
    'conv_1005': [
      {
        id: 'msg_1005_1',
        from: {
          id: '1005',
          name: '伊藤 直樹'
        },
        message: '中野区の物件について、周辺の環境を教えていただけますか？',
        created_time: '2025-03-08T11:20:10Z'
      },
      {
        id: 'msg_1005_2',
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: '伊藤様、お問い合わせありがとうございます。中野区の物件は駅から徒歩5分で、周辺にはスーパー、公園、病院があります。治安も良く、ファミリー向けの環境です。',
        created_time: '2025-03-08T11:25:33Z'
      },
      {
        id: 'msg_1005_3',
        from: {
          id: '1005',
          name: '伊藤 直樹'
        },
        message: '詳細な情報ありがとうございます。学校の情報もあれば教えてください。',
        created_time: '2025-03-08T11:30:22Z'
      },
      {
        id: 'msg_1005_4',
        from: {
          id: '975355974713289',
          name: '住宅四天王 エース'
        },
        message: '小学校は徒歩7分、中学校は徒歩10分の場所にあります。どちらも評判の良い学校です。詳細な資料をメールでお送りしますね。',
        created_time: '2025-03-08T11:32:45Z'
      },
      {
        id: 'msg_1005_5',
        from: {
          id: '1005',
          name: '伊藤 直樹'
        },
        message: 'ありがとうございました。検討してみます。',
        created_time: '2025-03-08T11:33:42Z'
      }
    ]
  };
  
  return mockMessagesMap[conversationId] || [];
}

/**
 * Generate a mock AI response for a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {Array} messages - Previous messages in the conversation
 * @returns {Object} Mock AI response
 */
export function generateMockAiResponse(conversationId, messages) {
  // Get the last customer message
  const customerMessages = messages.filter(msg => 
    msg.from.id !== '975355974713289'
  );
  
  if (customerMessages.length === 0) {
    return {
      text: 'お問い合わせありがとうございます。どのようなご質問でしょうか？',
      created_at: new Date().toISOString()
    };
  }
  
  const lastCustomerMessage = customerMessages[customerMessages.length - 1];
  
  // Generate response based on the last customer message
  let responseText = '';
  
  if (lastCustomerMessage.message.includes('駐車場')) {
    responseText = '当マンションの駐車場は1世帯につき1台分が確保されています。追加で契約することも可能ですが、空き状況によります。詳細はお問い合わせください。';
  } else if (lastCustomerMessage.message.includes('ペット')) {
    responseText = 'はい、当マンションはペット可物件です。小型犬や猫は飼育可能です。ただし、管理規約に従っていただく必要があります。';
  } else if (lastCustomerMessage.message.includes('資料')) {
    responseText = 'ご興味をお持ちいただきありがとうございます。詳細な資料をご用意いたしますので、ご連絡先をお知らせいただけますか？';
  } else if (lastCustomerMessage.message.includes('内見')) {
    responseText = '内見の日程変更は可能です。ご都合の良い日時をいくつかお知らせいただけますか？調整させていただきます。';
  } else if (lastCustomerMessage.message.includes('契約')) {
    responseText = 'ご契約のお手続きについてご案内いたします。必要書類は身分証明書、収入証明書、印鑑となります。お手続きは当社オフィスにて行います。';
  } else if (lastCustomerMessage.message.includes('学校')) {
    responseText = '周辺の教育環境についてご案内いたします。小学校は徒歩7分、中学校は徒歩10分の場所にあります。どちらも評判の良い学校です。詳細な資料をご用意できます。';
  } else {
    responseText = 'お問い合わせありがとうございます。ご質問の件について、詳細を確認してご連絡いたします。何かほかにご質問はございますか？';
  }
  
  return {
    text: responseText,
    created_at: new Date().toISOString()
  };
}
