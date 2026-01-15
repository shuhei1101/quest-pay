"use client"

import { createClient } from "@/app/(core)/_supabase/client"
import { LoginFormType } from "../form"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { queryClient } from "@/app/(core)/tanstack"
import { getLoginUser } from "@/app/api/users/login/client"
import { UserInfo } from "@/app/api/users/query"

/** ログイン時のハンドル */
export const useLogin = ({onSuccess}: {
  onSuccess: (userInfo: UserInfo) => void
}) => {

  const mutation = useMutation({
    mutationFn: async (form: LoginFormType) => createClient(form.rememberMe).auth.signInWithPassword({
        email: form.email,
        password: form.password
    }),
    onError: (err) => {
      toast.error("ログインに失敗しました。")
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      // ユーザ情報を取得する
      const { userInfo } = await getLoginUser()
      onSuccess(userInfo)
    }
  })

  return { 
    /** ログインハンドル */    
    login: mutation.mutate,
    /** ログイン処理中フラグ */
    isLoading: mutation.isPending,
    /** 成功フラグ */
    isSuccess: mutation.isSuccess,
    /** エラー */
    error: mutation.error
  }
}
