"use client"

import toast from "react-hot-toast"
import { LoginFormSchema } from "../_schema/loginSchema"
import { createClient } from "@/app/(core)/_supabase/client"

/** サインアップ時のハンドル */
export const useSignUp = () => {

  const handleSignUp = async (form: LoginFormSchema) => {
    // 新規登録する
    const { data, error } = await createClient().auth.signUp({
      email: form.email,
      password: form.password
    })

    // エラーをチェックする
    if (error) {
      console.error(error)
      toast.error(`エラー: ${JSON.stringify(error)}`)
      return
    }
    
    // メール確認メッセージを表示する
    toast('確認メールをお送りしました。\nメール内のリンクをクリックして登録を完了してください。')
  }
  return { handleSignUp }
}
