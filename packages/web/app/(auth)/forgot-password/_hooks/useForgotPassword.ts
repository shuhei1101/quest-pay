"use client"

import { createClient } from "@/app/(core)/_supabase/client"
import { ForgotPasswordFormType } from "../form"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { APP_DOMAIN, RESET_PASSWORD_URL } from "@/app/(core)/endpoints"

/** パスワードリセット依頼ハンドル */
export const useForgotPassword = ({onSuccess}: {
  onSuccess: () => void
}) => {

  const mutation = useMutation({
    mutationFn: async (form: ForgotPasswordFormType) => {
      return createClient().auth.resetPasswordForEmail(form.email, {
        redirectTo: `${APP_DOMAIN}${RESET_PASSWORD_URL}`
      })
    },
    onError: (err) => {
      toast.error("パスワードリセットメールの送信に失敗しました。")
    },
    onSuccess: () => {
      toast.success("パスワードリセットメールを送信しました。メールをご確認ください。")
      onSuccess()
    }
  })

  return { 
    /** パスワードリセット依頼ハンドル */
    forgotPassword: mutation.mutate,
    /** 処理中フラグ */
    isLoading: mutation.isPending,
    /** 成功フラグ */
    isSuccess: mutation.isSuccess,
    /** エラー */
    error: mutation.error
  }
}
