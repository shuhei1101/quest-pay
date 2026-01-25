"use client"

import { useEffect } from "react"
import toast from "react-hot-toast"
import { useSearchParams, useRouter } from "next/navigation"

/** アクセスエラーをハンドリングするコンポーネント */
export const AccessErrorHandler = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    // クエリパラメータからエラーメッセージを取得する
    const errorMessage = searchParams.get('error')
    
    if (errorMessage) {
      toast.error(errorMessage, { duration: 3000 })
      
      // エラーパラメータを削除する
      const params = new URLSearchParams(searchParams)
      params.delete('error')
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
      router.replace(newUrl)
    }
  }, [searchParams, router])
  
  return null
}
