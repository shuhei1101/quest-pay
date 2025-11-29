"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/errorHandler"
import { UserFormSchema } from "../../_schema/userSchema"
import { userApi } from "../../_api-client/userApi"
import toast from "react-hot-toast"

/** ユーザ保存のハンドル */
export const useUserSave = ({close}: {
  close: () => void
}) => {
  const router = useRouter()
  const handleSave = async (user: UserFormSchema) => {
    try {
      // ユーザを新規作成する
      const id = await userApi.create(user)
  
      // 成功メッセージを表示する
      toast('ユーザ情報を更新しました。')

      // ポップアップを閉じる
      close()
        
    } catch (err) {
      handleAppError(err, router)
    }
  }
  return { handleSave }
}
