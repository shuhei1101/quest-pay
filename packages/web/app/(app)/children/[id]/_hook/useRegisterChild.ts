"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { postChild } from "@/app/api/children/client"
import { ChildFormType } from "../form"


/** 登録ボタン押下時のハンドル */
export const useRegisterChild = ({setId}: {
  setId: (id: string | undefined) => void
}) => {
  const router = useRouter()

  /** 登録処理 */
  const mutation = useMutation({
    mutationFn: async ({form}: {form: ChildFormType}) => {
      const data = await postChild({form})
      return data
    },
    onSuccess: ( data ) => {
      // IDを更新する
      setId(data.childId)
      // フィードバックメッセージを表示する
      toast('子供を登録しました', {duration: 1500})
    },
    onError: (err) => {
      throw err
    }
  })

  /** 登録ハンドル */
  const handleRegister = ({form}: {form: ChildFormType}) => {
    if (!window.confirm('登録します。よろしいですか？')) return
    mutation.mutate({form})
  }

  return {
    handleRegister,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  }
}
