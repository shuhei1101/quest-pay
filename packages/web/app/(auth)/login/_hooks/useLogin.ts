"use client"

import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { HOME_URL } from "@/app/(core)/appConstants"
import { LoginFormSchema } from "../_schema/loginSchema"
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase"
import toast from "react-hot-toast"

/** ログイン時のハンドル */
export const useLogin = () => {
  const router = useRouter()
  const handleLogin = async (form: LoginFormSchema) => {

    // ログインする
    const { data, error } = await clientSupabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    // エラーをチェックする
    if (error) {
      console.error(error)
      toast.error("メールアドレスまたはパスワードが間違っています。")
      return
    }
    
    // 次画面で表示するメッセージを登録する
    appStorage.feedbackMessage.set('ログインしました')

    // ホーム画面に遷移する
    router.push(`${HOME_URL}`)
  }
  return { handleLogin }
}
