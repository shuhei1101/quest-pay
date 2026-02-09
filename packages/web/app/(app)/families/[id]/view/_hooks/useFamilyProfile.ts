"use client"

import { useQuery } from "@tanstack/react-query"
import { getFamilyProfile } from "@/app/api/families/[id]/client"

/** 家族プロフィール情報を取得する */
export const useFamilyProfile = ({familyId}: {
  familyId: string
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["familyProfile", familyId],
    queryFn: () => getFamilyProfile({familyId}),
  })

  return {
    profile: data,
    isLoading,
    error,
    refetch
  }
}
