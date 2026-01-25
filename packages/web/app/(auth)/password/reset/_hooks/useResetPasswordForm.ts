"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetPasswordFormScheme, ResetPasswordFormType } from "../form"

/** パスワード変更フォームを取得する */
export const useResetPasswordForm = () => {
  return useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordFormScheme),
    defaultValues: {
      password: "",
      passwordConfirm: ""
    }
  })
}
