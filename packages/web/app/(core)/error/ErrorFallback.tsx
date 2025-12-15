'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ROOT_URL } from '../constants'
import { appStorage } from '../_sessionStorage/appStorage'
import { devLog } from '../util'
import { FallbackProps } from 'react-error-boundary'

/** エラー時のフォールバックコンポーネント */
export const ErrorFallback = ({ error }: FallbackProps) => {
  const router = useRouter()

  useEffect(() => {
    devLog("ErrorBoundary.エラー内容: ", error)
    // 次画面で表示するメッセージを登録
    appStorage.feedbackMessage.set(error.message)
    
    // 前画面がある場合、遷移する
    const parentScreen = appStorage.parentScreen.get()
    router.push(`${parentScreen ?? ROOT_URL}`)
  }, [error, router])

  return (<>エラー画面</>)
}
