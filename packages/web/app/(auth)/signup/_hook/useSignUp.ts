"use client"

import toast from "react-hot-toast"
import { createClient } from "@/app/(core)/_supabase/client"
import { AuthFormType } from "../../login/form"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { VERIFY_EMAIL_URL } from "@/app/(core)/endpoints"

/** サインアップ時のハンドル */
export const useSignUp = () => {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (form: AuthFormType) => await createClient().auth.signUp({
      email: form.email,
      password: form.password
    }),
    onError: (err) => {
      toast.error("新規登録に失敗しました。")
    },
    onSuccess: (data, variables) => {
      // メールアドレスをクエリパラメータに含めて遷移する
      router.push(`${VERIFY_EMAIL_URL}?email=${encodeURIComponent(variables.email)}`)
    }
  })

  return { 
    signUp: mutation.mutate,
    /** エラー */
    error: mutation.error,
    /** 成功フラグ */
    isSuccess: mutation.isSuccess,
    /** サインアップ処理中フラグ */
    isLoading: mutation.isPending,  
  }
}
