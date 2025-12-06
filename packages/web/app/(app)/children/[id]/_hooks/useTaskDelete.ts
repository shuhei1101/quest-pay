"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/errorHandler"
import { questApi } from "../../../../api/children/_api-client/questApi"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { QUESTS_URL } from "@/app/(core)/constants"
import { QuestDelete } from "@/app/api/quests/entity"

/** 削除ボタン押下時のハンドル */
export const useQuestDelete = () => {
  const router = useRouter()
  const handleDelete = async (quest: QuestDelete) => {
    try {
      // 削除確認を行う
      if (window.confirm('削除します。よろしいですか？')) {

        // クエストを削除する
        await questApi.delete(quest)

        // 前画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('クエストを削除しました')
          
        // クエスト一覧画面に戻る
        router.push(`${QUESTS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleDelete }
}
