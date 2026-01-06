"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { FamilyRegisterFormType } from "../form"
import { postFamily } from "@/app/api/families/client"
import { devLog } from "@/app/(core)/util"
import { HOME_URL } from "@/app/(core)/endpoints"


/** 登録ボタン押下時のハンドル */
export const useRegisterFamily = () => {
  const router = useRouter()

  /** 登録処理 */
  const mutation = useMutation({
    mutationFn: ({form}: {form: FamilyRegisterFormType}) => postFamily({form}),
    onSuccess: ( data ) => {
      // フィードバックメッセージを表示する
      toast('家族を登録しました', {duration: 1500})
      // ホーム画面に遷移する
      router.push(HOME_URL)
    },
    onError: (error) => {
      // エラーをチェックする
        devLog("子供登録エラー: ", error)
        throw error
    }
  })

  /** 登録ハンドル */
  const handleRegister = ({form}: {form: FamilyRegisterFormType}) => {
    if (!window.confirm('登録します。よろしいですか？')) return
    mutation.mutate({form})
  }

  return {
    handleRegister,
    isLoading: mutation.isPending,
  }
}
