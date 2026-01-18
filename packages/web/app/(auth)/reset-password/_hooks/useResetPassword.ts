"use client"

import { createClient } from "@/app/(core)/_supabase/client"
import { ResetPasswordFormType } from "../form"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

/** パスワード変更ハンドル */
export const useResetPassword = ({onSuccess}: {
  onSuccess: () => void
}) => {

  const mutation = useMutation({
    mutationFn: async (form: ResetPasswordFormType) => {
      return createClient().auth.updateUser({
        password: form.password
      })
    },
    onError: (err) => {
      toast.error("パスワードの変更に失敗しました。")
    },
    onSuccess: () => {
      toast.success("パスワードを変更しました。")
      onSuccess()
    }
  })

  return { 
    /** パスワード変更ハンドル */
    resetPassword: mutation.mutate,
    /** 処理中フラグ */
    isLoading: mutation.isPending,
    /** 成功フラグ */
    isSuccess: mutation.isSuccess,
    /** エラー */
    error: mutation.error
  }
}
