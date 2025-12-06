"use client"

import { useRouter } from "next/navigation"
import { familyApi } from "../../../../api/families/_api-client/familyApi"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { handleAppError } from "@/app/(core)/errorHandler"
import { QUESTS_URL } from "@/app/(core)/constants"
import { FamilyCreateForm } from "../_schema/familyCreateFormSchema"

export const useFamilySave = () => {
  const router = useRouter()
  /** 新規作成ボタン押下時のハンドル */
  const handleSave = async ({userId, form} :{
    form: FamilyCreateForm,
    userId: string
  }) => {
    try {
      // 登録確認を行う
      if (window.confirm('登録します。よろしいですか？')) {
        // 家族を新規作成する
        await familyApi.create({
          form,
          userId: userId
        })
    
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('家族を登録しました')
          
        // クエスト一覧画面に遷移する
        router.push(`${QUESTS_URL}`)
      }
    } catch (err) {
      handleAppError(err, router)
    }
  }

  return { handleSave }

}
