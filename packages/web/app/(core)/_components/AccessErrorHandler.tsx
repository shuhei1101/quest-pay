"use client"

import { useEffect } from "react"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"

/** アクセスエラーをハンドリングするコンポーネント */
export const AccessErrorHandler = () => {
  const pathname = usePathname()
  
  useEffect(() => {
    // Cookieからアクセスエラーメッセージを取得する
    const cookies = document.cookie.split('; ')
    const accessErrorCookie = cookies.find(row => row.startsWith('accessError='))
    
    if (accessErrorCookie) {
      const message = decodeURIComponent(accessErrorCookie.split('=')[1])
      toast.error(message, { duration: 3000 })
      
      // Cookieを削除する
      document.cookie = 'accessError=; path=/; max-age=0'
    }
  }, [pathname])
  
  return null
}
