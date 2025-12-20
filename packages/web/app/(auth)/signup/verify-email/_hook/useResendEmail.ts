"use client"

import toast from "react-hot-toast"
import { createClient } from "@/app/(core)/_supabase/client"
import { useMutation } from "@tanstack/react-query"

/** メール再送時のハンドル */
export const useResendEmail = () => {

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await createClient().auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      return data
    },
    onError: (err) => {
      toast.error("メールの再送信に失敗しました")
    },
    onSuccess: () => {
      toast.success("確認メールを再送信しました")
    }
  })

  return { 
    /** メール再送ハンドル */
    resendEmail: mutation.mutate,
    /** メール再送処理中フラグ */
    isLoading: mutation.isPending,
    /** 成功フラグ */
    isSuccess: mutation.isSuccess,
    /** エラー */
    error: mutation.error
  }
}
