"use client"
import useSWR from "swr"
import { fetchFamily } from "../_query/familyQuery"
import { fetchChild } from "@/app/(child)/_query/childQuery"
import { fetchParent } from "@/app/(parent)/_query/parentQuery"
import { useLoginUserInfo } from "@/app/(auth)/_hooks/useLoginUserInfo"

/** 家族の情報を取得する */
export const useUserFamily = () => {

  /** ログインユーザ情報 */
  const { userInfo } = useLoginUserInfo()
  
  const { data, error, mutate, isLoading } = useSWR(
    userInfo?.user_id ? ["userFamily", userInfo.user_id] : undefined,
    async () => {
      const child = await fetchChild(userInfo!.user_id)
      const parent = await fetchParent(userInfo!.user_id)
      const familyId = parent?.family_id || child?.family_id
      const family = familyId ? await fetchFamily(familyId) : undefined
      return { child, parent, family }
    }
  )

  return { 
    child: data?.child,
    parent: data?.parent,
    family: data?.family,
    error, 
    isLoading, 
    mutate 
  }
}
