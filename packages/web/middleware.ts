import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // ルートパスにアクセスした場合、ログイン画面にリダイレクトする
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

/** middlewareを適用するパスを指定 */
export const config = {
  matcher: [
    '/',  // ルートパスのみ
  ]
}
