import { useQuery } from "@tanstack/react-query"
import { getFamilyTimelines } from "@/app/api/timeline/family/client"

/** 家族タイムラインを取得する */
export const useFamilyTimelines = () => {
  return useQuery({
    queryKey: ["familyTimelines"],
    queryFn: async () => {
      const data = await getFamilyTimelines()
      return data.timelines
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  })
}
