/**
 * API endpoint for checking Instagram access token status
 */

export async function GET() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return Response.json({
        status: 'error',
        error: 'アクセストークンが設定されていません',
        code: 'NO_TOKEN'
      });
    }
    
    // Validate token
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return Response.json({
        status: 'error',
        error: 'トークンの検証に失敗しました',
        code: response.status,
        details: data.error
      });
    }
    
    if (!data.data || !data.data.is_valid) {
      // Check if this is an expired token (code 190)
      if (data.error?.code === 190 || (data.data && data.data.error && data.data.error.code === 190)) {
        return Response.json({
          status: 'expired',
          error: 'アクセストークンが期限切れです',
          code: 190,
          renewal_guide: '/settings/token-renewal'
        });
      }
      
      return Response.json({
        status: 'invalid',
        error: 'トークンが無効です',
        code: data.error?.code || 400,
        details: data.error
      });
    }
    
    // Token is valid, return detailed information
    return Response.json({
      status: 'valid',
      app_id: data.data.app_id,
      application: data.data.application,
      expires_at: data.data.expires_at 
        ? new Date(data.data.expires_at * 1000).toISOString()
        : null,
      scopes: data.data.scopes || [],
      user_id: data.data.user_id,
      is_valid: true
    });
    
  } catch (error) {
    console.error('Error checking token status:', error);
    return Response.json({
      status: 'error',
      error: 'トークンステータスの確認中にエラーが発生しました',
      message: error.message
    }, { status: 500 });
  }
}
