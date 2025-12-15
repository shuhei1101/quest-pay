'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { handleAppError } from './handler/client'

/** エラー時のフォールバックコンポーネント */
export const ErrorFallback = ({ error }: FallbackProps) => {
  const router = useRouter()

  useEffect(() => {
    handleAppError(error, router)
  }, [error, router])

  return null
}
