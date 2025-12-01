"use client"
import useSWR from "swr"
import { fetchFamily } from "../_query/familyQuery"
import { fetchChild } from "@/app/(child)/_query/childQuery"
import { fetchParent } from "@/app/(parent)/_query/parentQuery"

/** 家族の情報を取得する */
export const useUserFamily = (userId?: string) => {
  const { data, error, mutate, isLoading } = useSWR(
    userId ? ["userFamily", userId] : undefined,
    async () => {
      // const child = await fetchChild(userId!)
      const parent = await fetchParent(userId!)
      const familyId = parent?.family_id
      const family = familyId ? await fetchFamily(familyId) : undefined
      return { parent, family }
    }
  )


  return { data, error, isLoading, mutate }
}
