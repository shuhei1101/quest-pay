"use client"

import { useRouter } from "next/navigation"
import { questApi } from "../../../../api/children/_api-client/questApi"
import { handleAppError } from "@/app/(core)/errorHandler"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { QUESTS_URL } from "@/app/(core)/constants"
import { UpdateQuestRequest } from "../../api/schema"

/** 更新ボタン押下時のハンドル */
export const useQuestUpdate = () => {
  const router = useRouter()
  const handleUpdate = async (request: UpdateQuestRequest) => {
    try {
      // 更新確認を行う
      if (window.confirm('更新します。よろしいですか？')) {
        // クエストを更新する
        await questApi.update(request)
        
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('クエストを更新しました')

        // クエスト一覧画面に戻る
        router.push(`${QUESTS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleUpdate }
}
