'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { appStorage } from '../_sessionStorage/appStorage'
import { LOGIN_URL } from '../endpoints'

/** エラー時のフォールバックコンポーネント */
export const ErrorFallback = ({ error }: FallbackProps) => {

  useEffect(() => {
    // 次画面で表示するメッセージを登録
    appStorage.feedbackMessage.set({ message: error.message, type: "error" })
    // ログイン画面にリダイレクトする
    redirect(LOGIN_URL)
  }, [error])

  return null
}
