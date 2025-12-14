"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { FamilyRegisterFormType } from "../form"
import { postFamily } from "@/app/api/families/client"
import { devLog } from "@/app/(core)/util"


/** 登録ボタン押下時のハンドル */
export const useRegisterFamily = () => {
  const router = useRouter()

  /** 登録処理 */
  const mutation = useMutation({
    mutationFn: ({form}: {form: FamilyRegisterFormType}) => postFamily({
      family: {
        display_id: form.displayId,
        local_name: form.localName,
        online_name: form.onlineName,
        icon_color: form.familyIconColor,
        icon_id: form.familyIconId,
      },
      parent: {
        birthday: form.parentBirthday,
        name: form.parentName,
        icon_color: form.parentIconColor,
        icon_id: form.parentIconId,
      },
    }),
    onSuccess: ( data ) => {
      // フィードバックメッセージを表示する
      toast('家族を登録しました', {duration: 1500})
    },
    onError: (error) => {
      // エラーをチェックする
        devLog("子供登録エラー: ", error)
        handleAppError(error, router)
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
