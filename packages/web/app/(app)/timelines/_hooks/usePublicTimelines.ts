import { useQuery } from "@tanstack/react-query"
import { getPublicTimelines } from "@/app/api/timelines/public/client"

/** 公開タイムラインを取得する */
export const usePublicTimelines = () => {
  return useQuery({
    queryKey: ["publicTimelines"],
    queryFn: async () => {
      const data = await getPublicTimelines()
      return data.timelines
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  })
}
