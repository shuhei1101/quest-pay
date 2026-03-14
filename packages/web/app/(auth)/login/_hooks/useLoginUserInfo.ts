"use client"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { logger } from "@/app/(core)/logger"
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
      logger.debug("セッションストレージからユーザ情報取得", { userInfo })
      // ユーザ情報がない場合
      if (!userInfo) {
        // ユーザ情報を取得する
        const { userInfo } = await getLoginUser()
        if (!userInfo) return { isGuest: true }
        logger.debug("APIからユーザ情報取得", { userInfo })
        // セッションストレージに格納する
        appStorage.user.set(userInfo)
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
