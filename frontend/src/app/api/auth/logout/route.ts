import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  response.cookies.set('tfl_admin_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set('tfl_admin_client_auth', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
