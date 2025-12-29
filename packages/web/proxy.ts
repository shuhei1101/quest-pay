import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOGIN_URL } from './app/(core)/endpoints'

export default function(request: NextRequest) {
  // ルートパスにアクセスした場合、ログイン画面にリダイレクトする
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(LOGIN_URL, request.url))
  }
  return NextResponse.next()
}

/** proxyを適用するパスを指定 */
export const config = {
  matcher: [
    '/',  // ルートパスのみ
  ]
}
