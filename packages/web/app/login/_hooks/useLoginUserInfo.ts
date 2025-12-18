"use client"
import { useQuery } from "@tanstack/react-query"
import { getLoginUserInfo } from "../_service/getLoginUserInfo"

/** ログインユーザの情報を取得する */
export const useLoginUserInfo = ({ caching = true }: {
  caching?: boolean
} = {}) => {

  const query = useQuery({
    queryKey: ["loginUser"],
    retry: false,
    queryFn: () => getLoginUserInfo({ caching }),
  })

  return {
    userInfo: query.data?.userInfo,
    isGuest: query.data?.isGuest ?? true,
    isParent: query.data?.isParent ?? false,
    isChild: query.data?.isChild ?? false,
    isLoading: query.isLoading,
    refetch: query.refetch
  }
}
