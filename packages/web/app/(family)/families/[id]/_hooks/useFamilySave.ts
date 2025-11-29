"use client"

import { useRouter } from "next/navigation"
import { familyApi } from "../../../_api-client/familyApi"
import { FamilyFormSchema } from "../../../_schema/familySchema"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { handleAppError } from "@/app/(core)/errorHandler"
import { TASKS_URL } from "@/app/(core)/appConstants"

/** 新規作成ボタン押下時のハンドル */
export const useFamilySave = () => {
  const router = useRouter()
  const handleSave = async (family: FamilyFormSchema) => {
    try {
      // 登録確認を行う
      if (window.confirm('登録します。よろしいですか？')) {
        // 家族を新規作成する
        const id = await familyApi.create(family)
    
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('家族を登録しました')
          
        // 家族一覧画面に戻る
        router.push(`${TASKS_URL}`)
      }
    } catch (err) {
      handleAppError(err, router)
    }
  }
  return { handleSave }
}
