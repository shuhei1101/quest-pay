"use client"

import toast from "react-hot-toast"
import { createClient } from "@/app/(core)/_supabase/client"
import { LoginFormType } from "../../login/form"
import { useMutation } from "@tanstack/react-query"

/** サインアップ時のハンドル */
export const useSignUp = () => {

    const mutation = useMutation({
      mutationFn: async (form: LoginFormType) => await createClient().auth.signUp({
        email: form.email,
        password: form.password
      }),
      onError: (err) => {
        toast.error("新規登録に失敗しました。")
      },
      onSuccess: () => {
        toast('確認メールをお送りしました。\nメール内のリンクをクリックして登録を完了してください。')
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
