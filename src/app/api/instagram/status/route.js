/**
 * API route for checking Instagram API status
 * Provides detailed information about token validity and permissions
 */

import { NextResponse } from 'next/server';

// Check token validity
async function checkTokenValidity(accessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        valid: false,
        error: errorData,
        message: '無効なアクセストークンです。'
      };
    }
    
    const data = await response.json();
    return {
      valid: data.data.is_valid,
      type: data.data.type,
      scopes: data.data.scopes || [],
      expiresAt: data.data.expires_at ? new Date(data.data.expires_at * 1000).toISOString() : null,
      dataAccessExpiresAt: data.data.data_access_expires_at ? new Date(data.data.data_access_expires_at * 1000).toISOString() : null,
      message: data.data.is_valid ? 'アクセストークンは有効です。' : 'アクセストークンは無効です。'
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      message: 'トークン検証中にエラーが発生しました。'
    };
  }
}

export async function GET(request) {
  try {
    // Get access token from environment variable or request header
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || 
                        request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json({
        status: 'error',
        message: 'アクセストークンが必要です。',
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }
    
    // Check token validity
    const tokenStatus = await checkTokenValidity(accessToken);
    
    return NextResponse.json({
      status: tokenStatus.valid ? 'ok' : 'error',
      message: tokenStatus.message,
      tokenStatus: tokenStatus,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'APIステータスの確認中にエラーが発生しました。',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
