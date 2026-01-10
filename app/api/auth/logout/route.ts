// Logout Route Handler
// Changes:
// - 2024-12-XX: Fixed server-side error by using clearSessionCookieOnResponse instead of clearSession (cookies() doesn't work in Route Handlers)
// - 2026-01-10: Fixed redirect issue with form POST by returning HTML with meta refresh
import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookieOnResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Create HTML response with meta refresh redirect
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=/" />
      </head>
      <body>
        <script>window.location.href = '/';</script>
      </body>
    </html>
  `;

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });

  return clearSessionCookieOnResponse(response);
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  return clearSessionCookieOnResponse(response);
}
