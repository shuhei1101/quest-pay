"use client"

import { useEffect } from "react"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"

/** Cookieからアクセスエラーメッセージを取得する */
const getAccessErrorCookie = () => {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split('; ')
  const accessErrorCookie = cookies.find(row => row.startsWith('accessError='))
  
  if (accessErrorCookie) {
    return decodeURIComponent(accessErrorCookie.split('=')[1])
  }
  
  return null
}

/** Cookieを削除する */
const deleteAccessErrorCookie = () => {
  if (typeof document === 'undefined') return
  document.cookie = 'accessError=; path=/; max-age=0; SameSite=Lax'
}

/** アクセスエラーをハンドリングするコンポーネント */
export const AccessErrorHandler = () => {
  const pathname = usePathname()
  
  useEffect(() => {
    // Cookieからアクセスエラーメッセージを取得する
    const message = getAccessErrorCookie()
    
    if (message) {
      toast.error(message, { duration: 3000 })
      // Cookieを削除する
      deleteAccessErrorCookie()
    }
  }, [pathname])
  
  return null
}
