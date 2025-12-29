"use client"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { getLoginUser } from "@/app/api/users/login/client"
import { useQuery } from "@tanstack/react-query"

/** ログインユーザの情報を取得する */
export const useLoginUserInfo = () => {

  const query = useQuery({
    queryKey: ["loginUser"],
    retry: false,
    queryFn: async () => {
      // セッションストレージからユーザ情報を取得する
      let userInfo = appStorage.user.get()
      // ユーザ情報がない場合
      if (!userInfo) {
        // ユーザ情報を取得する
        const { userInfo } = await getLoginUser()
        if (!userInfo) return { isGuest: true }
        // セッションストレージに格納する
        appStorage.user.set(userInfo)
      }
      return {
        userInfo,
        isGuest: false,
      }
    }
  })

  return {
    userInfo: query.data?.userInfo,
    isGuest: query.data?.isGuest ?? true,
    isParent: query.data?.userInfo?.type === "parent",
    isChild: query.data?.userInfo?.type === "child",
    isLoading: query.isLoading,
    refetch: query.refetch
  }
}
