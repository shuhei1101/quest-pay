"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ForgotPasswordFormScheme, ForgotPasswordFormType } from "../form"

/** パスワードリセット依頼フォームを取得する */
export const useForgotPasswordForm = () => {
  return useForm<ForgotPasswordFormType>({
    resolver: zodResolver(ForgotPasswordFormScheme),
    defaultValues: {
      email: ""
    }
  })
}
