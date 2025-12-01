"use client"
import { useEffect, useState } from "react"
import { useSession } from "./useSession"
import { UserEntity } from "../../(user)/_schema/userSchema"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { fetchUser } from "../../(user)/_query/userQuery";

/** ログインユーザの情報を取得する */
export const useLoginUserInfo = () => {
  const { session, isLoading: sessionLoading } = useSession()
  const [userInfo, setUserInfo] = useState<UserEntity>()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (sessionLoading || !session) return
    const getUserInfo = async () => {
      // セッションストレージからユーザ情報を取得する
      let userInfo = appStorage.user.get()
      // ユーザ情報がない場合
      if (!userInfo) {
      // ユーザ情報を取得する
        userInfo = await fetchUser(session.user.id)
        // ユーザ情報が取得できた場合、セッションストレージに格納する
        if (userInfo) appStorage.user.set(userInfo)
      }
      setUserInfo(userInfo)
    }
    getUserInfo()
    // ロード状態を解除する
    setIsLoading(false)
  }, [session, sessionLoading])

  return {
    userInfo,
    isLoading,
    session,
  }
}
