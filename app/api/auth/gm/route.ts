import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify GM password from environment variable
    const gmPassword = process.env.GM_PASSWORD;

    console.log('GM Login attempt:');
    console.log('- Received password:', password);
    console.log('- Expected password:', gmPassword);
    console.log('- Password length received:', password.length);
    console.log('- Password length expected:', gmPassword?.length);
    console.log('- Match:', password === gmPassword);

    if (!gmPassword) {
      console.error('GM_PASSWORD not configured in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (password !== gmPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create GM session
    await setSessionCookie({
      type: 'gm',
    });

    // Return success
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('GM auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
