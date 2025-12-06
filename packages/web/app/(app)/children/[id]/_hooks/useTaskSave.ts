"use client"

import { useRouter } from "next/navigation"
import { questApi } from "../../../../api/children/_api-client/questApi"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { handleAppError } from "@/app/(core)/errorHandler"
import { QUESTS_URL } from "@/app/(core)/constants"
import { RegisterQuestRequest } from "../../api/schema"

/** 新規作成ボタン押下時のハンドル */
export const useQuestSave = () => {
  const router = useRouter()
  const handleSave = async (request: RegisterQuestRequest) => {
    try {
      // 登録確認を行う
      if (window.confirm('登録します。よろしいですか？')) {
        // クエストを新規作成する
        await questApi.create(request)
    
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('クエストを登録しました')
          
        // クエスト一覧画面に戻る
        router.push(`${QUESTS_URL}`)
      }
    } catch (err) {
      handleAppError(err, router)
    }
  }
  return { handleSave }
}
