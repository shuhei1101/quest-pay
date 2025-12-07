"use client"

import toast from "react-hot-toast"
import { useState } from "react"
import { createClient } from "@/app/(core)/_supabase/client"
import { LoginFormType } from "../form"

/** ログイン時のハンドル */
export const useLogin = () => {
  const [userId, setUserId] = useState("")
  const handleLogin = async ({onSuccess, form}: {
    form: LoginFormType,
    onSuccess: () => void
  }) => {

    // ログインする
    const { data, error } = await createClient().auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    // エラーをチェックする
    if (error) {
      console.error(error)
      toast.error("メールアドレスまたはパスワードが間違っています。")
      return
    }
    
    // ユーザIDをセットする
    setUserId(data.user.id)

    // 成功後の処理を実行する
    onSuccess()
  }
  return { 
    /** ログインハンドル */    
    handleLogin, 
    /** ユーザID */
    userId
  }
}
