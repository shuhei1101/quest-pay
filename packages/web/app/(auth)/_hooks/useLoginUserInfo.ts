"use client"
import { useEffect, useState } from "react"
import { useAuthCheck } from "./useAuthCheck"
import { RawUser } from "../../(user)/_schema/userSchema"

export const useLoginUserInfo = () => {
  const { checkAuth } = useAuthCheck()
  const [userInfo, setUserInfo] = useState<RawUser>()
  const [userId, setUserId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const getUserInfo = async () => {
      // ローディング中にする
      setIsLoading(true)
      // 認可処理を行う
      const result = await checkAuth()
      if (result) {
        setUserInfo(result.userInfo)
        setUserId(result.userId ?? "")
      }
      setIsLoading(false)
    }
    getUserInfo()
  }, [])

  return {
    userInfo,
    userId,
    isLoading,
    isAdmin: userInfo?.type_id == 3,
    isGuest: userInfo?.type_id == 1
  }
}
