import { useQuery } from "@tanstack/react-query"
import { getChildAgeRewardTable } from "@/app/api/children/[id]/reward/by-age/table/client"
import { getChildLevelRewardTable } from "@/app/api/children/[id]/reward/by-level/table/client"

/** 子供個別の年齢別報酬テーブルを取得する */
export const useChildAgeRewardTable = (childId: string) => {
  return useQuery({
    queryKey: ["childAgeRewardTable", childId],
    queryFn: () => getChildAgeRewardTable(childId),
    staleTime: 0,
    refetchOnMount: "always",
  })
}

/** 子供個別のレベル別報酬テーブルを取得する */
export const useChildLevelRewardTable = (childId: string) => {
  return useQuery({
    queryKey: ["childLevelRewardTable", childId],
    queryFn: () => getChildLevelRewardTable(childId),
    staleTime: 0,
    refetchOnMount: "always",
  })
}
