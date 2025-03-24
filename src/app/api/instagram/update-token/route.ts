import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'トークンが提供されていません' },
        { status: 400 }
      );
    }
    
    // Validate the token
    const validationResponse = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`
    );
    
    const validationData = await validationResponse.json();
    
    if (!validationResponse.ok || !validationData.data || !validationData.data.is_valid) {
      return NextResponse.json(
        { 
          error: '無効なトークンです。有効なトークンを提供してください。',
          details: validationData.error || validationData
        },
        { status: 400 }
      );
    }
    
    // In a production app, you would update the token in a secure way
    // For this demo, we'll just log that it would be updated
    console.log('Token would be updated to:', token);
    
    // Return success
    return NextResponse.json({
      success: true,
      message: 'トークンが正常に検証されました。実際の環境では、このトークンが保存されます。',
      token_info: {
        app_id: validationData.data.app_id,
        expires_at: validationData.data.expires_at 
          ? new Date(validationData.data.expires_at * 1000).toISOString()
          : 'Never',
        scopes: validationData.data.scopes || []
      }
    });
  } catch (error: any) {
    console.error('Error updating token:', error);
    return NextResponse.json(
      { error: 'トークン更新中にエラーが発生しました: ' + error.message },
      { status: 500 }
    );
  }
}
