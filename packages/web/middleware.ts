import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PARENT_QUESTS_URL } from './app/(core)/constants'

export function middleware(request: NextRequest) {
  // ルートパスにアクセスした場合、ログイン画面にリダイレクトする
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(PARENT_QUESTS_URL, request.url))
  }
  return NextResponse.next()
}

/** middlewareを適用するパスを指定 */
export const config = {
  matcher: [
    '/',  // ルートパスのみ
  ]
}
