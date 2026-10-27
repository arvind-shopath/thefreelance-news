import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PHONE = process.env.ADMIN_PHONE || '9723338321';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Aarya@101021';
const AUTH_TOKEN = 'arvind_auth_token_9723338321';
const SESSION_VALUE = 'authenticated_arvind_9723338321';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = body || {};

    // Enforce 500ms delay to mitigate brute-force and timing attacks
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cleanPhone = String(phone || '').trim();
    const cleanPass = String(password || '').trim();

    if (cleanPhone !== ADMIN_PHONE || cleanPass !== ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error: 'अमान्य क्रेडेंशियल्स! केवल अधिकृत व्यवस्थापक ही प्रवेश कर सकते हैं।',
        },
        { status: 401 },
      );
    }

    // Success response with secure 30-day session cookie
    const response = NextResponse.json({
      success: true,
      token: AUTH_TOKEN,
      user: 'Arvind (Admin)',
    });

    const maxAge = 60 * 60 * 24 * 30; // 30 days

    // Secure HttpOnly session cookie (read by Next.js middleware)
    response.cookies.set('tfl_admin_session', SESSION_VALUE, {
      path: '/',
      maxAge,
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Client-accessible flag for client UI state
    response.cookies.set('tfl_admin_client_auth', '1', {
      path: '/',
      maxAge,
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error: any) {
    console.error('Login error detail:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'प्रमाणीकरण में आंतरिक त्रुटि आई।' },
      { status: 500 },
    );
  }
}
