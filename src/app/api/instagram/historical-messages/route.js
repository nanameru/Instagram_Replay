/**
 * API route for retrieving historical Instagram DMs
 * Falls back to enhanced mock data when API access fails
 */

import { NextResponse } from 'next/server';

// Import enhanced mock data
const enhancedMockData = require('../../../lib/enhanced-mock-data');

export async function GET(request) {
  try {
    // Get access token from environment variable or request header
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || 
                        request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json(
        { 
          error: 'アクセストークンが必要です',
          isMockData: true,
          data: enhancedMockData.generateAllConversations()
        },
        { status: 401 }
      );
    }
    
    // Try to get Instagram business account ID
    try {
      // Get Facebook pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`,
        { method: 'GET' }
      );
      
      if (!pagesResponse.ok) {
        throw new Error('Failed to get Facebook pages');
      }
      
      const pagesData = await pagesResponse.json();
      
      if (!pagesData.data || pagesData.data.length === 0) {
        throw new Error('No Facebook pages found');
      }
      
      const pageId = pagesData.data[0].id;
      
      // Get Instagram business account connected to this page
      const igResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`,
        { method: 'GET' }
      );
      
      if (!igResponse.ok) {
        const errorData = await igResponse.json();
        console.error('Error getting Instagram business account:', errorData);
        
        // Return mock data with error information
        return NextResponse.json({
          success: false,
          error: `Instagram Business Accountの取得に失敗しました: ${JSON.stringify(errorData)}`,
          isMockData: true,
          data: enhancedMockData.generateAllConversations()
        });
      }
      
      const igData = await igResponse.json();
      
      if (!igData.instagram_business_account) {
        // Return mock data with error information
        return NextResponse.json({
          success: false,
          error: 'Instagram Business Accountが連携されていません。ビジネスアカウントの設定を確認してください。',
          isMockData: true,
          data: enhancedMockData.generateAllConversations()
        });
      }
      
      // Return mock data with success information
      return NextResponse.json({
        success: true,
        message: 'Instagram Business Accountが見つかりましたが、現在はモックデータを使用しています。',
        isMockData: true,
        data: enhancedMockData.generateAllConversations()
      });
      
    } catch (error) {
      console.error('Error in API call:', error);
      
      // Return enhanced mock data as fallback with error information
      return NextResponse.json({
        success: false,
        error: error.message,
        isMockData: true,
        data: enhancedMockData.generateAllConversations()
      });
    }
  } catch (error) {
    console.error('Error in historical messages API:', error);
    
    // Return enhanced mock data as fallback with error information
    return NextResponse.json({
      success: false,
      error: error.message,
      isMockData: true,
      data: enhancedMockData.generateAllConversations()
    });
  }
}
