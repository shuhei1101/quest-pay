"use client"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { devLog } from "@/app/(core)/util"
import { getLoginUser } from "@/app/api/users/login/client"
import { useQuery } from "@tanstack/react-query"
import { AppError, AUTHORIZED_ERROR_CODE } from "@/app/(core)/error/appError"

/** ログインユーザの情報を取得する */
export const useLoginUserInfo = () => {

  const query = useQuery({
    queryKey: ["loginUser"],
    retry: false,
    queryFn: async () => {
      // セッションストレージからユーザ情報を取得する
      let userInfo = appStorage.user.get()
      devLog("useLoginUserInfo.セッションストレージのユーザ情報: ", userInfo)
      // ユーザ情報がない場合
      if (!userInfo) {
        try {
          // ユーザ情報を取得する
          const { userInfo } = await getLoginUser()
          if (!userInfo) return { isGuest: true }
          devLog("useLoginUserInfo.API取得後のユーザ情報: ", userInfo)
          // セッションストレージに格納する
          appStorage.user.set(userInfo)
        } catch (error) {
          // 認証エラーの場合はゲストとして扱う
          if (error instanceof AppError && error.code === AUTHORIZED_ERROR_CODE) {
            devLog("useLoginUserInfo.認証エラー: ゲストとして扱う")
            return { isGuest: true }
          }
          // その他のエラーは再スローする
          throw error
        }
      }
      return {
        userInfo,
        isGuest: false,
      }
    },
    staleTime: 0,
    refetchOnMount: "always",
  })

  return {
    userInfo: query.data?.userInfo,
    isGuest: query.data?.isGuest ?? true,
    isParent: query.data?.userInfo?.profiles?.type === "parent",
    isChild: query.data?.userInfo?.profiles?.type === "child",
    isLoading: query.isLoading,
    refetch: query.refetch
  }
}
