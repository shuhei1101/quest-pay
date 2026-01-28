import { useQuery } from "@tanstack/react-query"
import { getFamilyAgeRewardTable } from "@/app/api/reward/age/table/client"
import { getFamilyLevelRewardTable } from "@/app/api/reward/level/table/client"

/** 年齢別報酬テーブルを取得する */
export const useAgeRewardTable = () => {
  return useQuery({
    queryKey: ["ageRewardTable"],
    queryFn: () => getFamilyAgeRewardTable()
  })
}

/** レベル別報酬テーブルを取得する */
export const useLevelRewardTable = () => {
  return useQuery({
    queryKey: ["levelRewardTable"],
    queryFn: () => getFamilyLevelRewardTable()
  })
}
