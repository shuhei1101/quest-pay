// このファイルは後方互換性のために残されています
// 新しいコードでは by-age/_hooks/useAgeRewardForm.ts と by-level/_hooks/useLevelRewardForm.ts を直接インポートしてください

import { useQuery } from "@tanstack/react-query"
import { getFamilyAgeRewardTable } from "@/app/api/reward/by-age/table/client"
import { getFamilyLevelRewardTable } from "@/app/api/reward/by-level/table/client"

/** 年齢別報酬テーブルを取得する */
export const useAgeRewardTable = () => {
  return useQuery({
    queryKey: ["ageRewardTable"],
    queryFn: () => getFamilyAgeRewardTable(),
    staleTime: 0,
    refetchOnMount: "always",
  })
}

/** レベル別報酬テーブルを取得する */
export const useLevelRewardTable = () => {
  return useQuery({
    queryKey: ["levelRewardTable"],
    queryFn: () => getFamilyLevelRewardTable(),
    staleTime: 0,
    refetchOnMount: "always",
  })
}
