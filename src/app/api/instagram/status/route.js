/**
 * API route for checking Instagram API status
 * Provides detailed information about token validity and permissions
 */

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get access token from environment variable or request header
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || 
                        request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json({
        status: 'error',
        message: 'アクセストークンが設定されていません',
        validToken: false,
        permissions: [],
        businessAccount: false,
        timestamp: new Date().toISOString()
      });
    }
    
    try {
      // Check token validity
      const tokenResponse = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`,
        { method: 'GET' }
      );
      
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        return NextResponse.json({
          status: 'error',
          message: `トークン検証エラー: ${JSON.stringify(errorData)}`,
          validToken: false,
          permissions: [],
          businessAccount: false,
          timestamp: new Date().toISOString()
        });
      }
      
      const tokenData = await tokenResponse.json();
      
      // Check if token is valid
      if (!tokenData.data.is_valid) {
        return NextResponse.json({
          status: 'error',
          message: 'トークンが無効です',
          validToken: false,
          tokenData: tokenData.data,
          permissions: tokenData.data.scopes || [],
          businessAccount: false,
          timestamp: new Date().toISOString()
        });
      }
      
      // Check for required permissions
      const requiredPermissions = ['instagram_basic', 'instagram_manage_messages', 'pages_messaging'];
      const hasRequiredPermissions = requiredPermissions.every(
        permission => tokenData.data.scopes.includes(permission)
      );
      
      // Try to get Facebook pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`,
        { method: 'GET' }
      );
      
      let hasPages = false;
      let pageId = null;
      
      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json();
        hasPages = pagesData.data && pagesData.data.length > 0;
        if (hasPages) {
          pageId = pagesData.data[0].id;
        }
      }
      
      // Check for Instagram business account
      let hasBusinessAccount = false;
      let businessAccountId = null;
      
      if (pageId) {
        const igResponse = await fetch(
          `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`,
          { method: 'GET' }
        );
        
        if (igResponse.ok) {
          const igData = await igResponse.json();
          hasBusinessAccount = !!igData.instagram_business_account;
          if (hasBusinessAccount) {
            businessAccountId = igData.instagram_business_account.id;
          }
        }
      }
      
      return NextResponse.json({
        status: 'success',
        message: hasBusinessAccount 
          ? 'Instagram APIに正常に接続されています' 
          : 'トークンは有効ですが、Instagram Business Accountが見つかりません',
        validToken: true,
        tokenData: {
          appId: tokenData.data.app_id,
          expiresAt: tokenData.data.expires_at ? new Date(tokenData.data.expires_at * 1000).toISOString() : null,
          issuedAt: new Date(tokenData.data.issued_at * 1000).toISOString(),
          userId: tokenData.data.user_id
        },
        permissions: tokenData.data.scopes || [],
        hasRequiredPermissions,
        missingPermissions: requiredPermissions.filter(
          permission => !tokenData.data.scopes.includes(permission)
        ),
        hasPages,
        pageId,
        businessAccount: hasBusinessAccount,
        businessAccountId,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error checking API status:', error);
      
      return NextResponse.json({
        status: 'error',
        message: `API状態チェックエラー: ${error.message}`,
        validToken: false,
        permissions: [],
        businessAccount: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in status API:', error);
    
    return NextResponse.json({
      status: 'error',
      message: `サーバーエラー: ${error.message}`,
      validToken: false,
      permissions: [],
      businessAccount: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
