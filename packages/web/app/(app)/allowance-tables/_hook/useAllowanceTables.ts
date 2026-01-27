import { useQuery } from "@tanstack/react-query"
import { getAllowanceTables } from "@/app/api/allowance-tables/client"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** お小遣いテーブルデータを取得する */
export const useAllowanceTables = () => {
  const { error, data, isLoading } = useQuery({
    queryKey: ["AllowanceTables"],
    queryFn: () => getAllowanceTables(),
    retry: false
  })

  if (error) {
    handleAppError({error})
  }

  return {
    allowanceTable: data?.allowanceTable,
    levelTable: data?.levelTable,
    isLoading
  }
}
