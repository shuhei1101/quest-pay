import { useMutation, useQueryClient } from "@tanstack/react-query"
import { putAllowanceTables } from "@/app/api/allowance-tables/client"
import { PutAllowanceTablesRequest } from "@/app/api/allowance-tables/route"
import { handleAppError } from "@/app/(core)/error/handler/client"
import toast from "react-hot-toast"

/** お小遣いテーブルを更新する */
export const useUpdateAllowanceTables = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (request: PutAllowanceTablesRequest) => putAllowanceTables(request),
    onSuccess: () => {
      // キャッシュを無効化して再取得する
      queryClient.invalidateQueries({ queryKey: ["AllowanceTables"] })
      // 成功通知を表示する
      toast.success("お小遣い設定を保存しました", { duration: 1500 })
    },
    onError: (error) => {
      handleAppError({ error })
    }
  })

  return {
    updateAllowanceTables: mutation.mutate,
    isUpdating: mutation.isPending
  }
}
