"use client"

import { useRouter } from "next/navigation"
import { taskApi } from "../../../_api-client/taskApi"
import { handleAppError } from "@/app/(core)/errorHandler"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { TASKS_URL } from "@/app/(core)/appConstants"
import { UpdateTaskRequest } from "../../api/schema"

/** 更新ボタン押下時のハンドル */
export const useTaskUpdate = () => {
  const router = useRouter()
  const handleUpdate = async (request: UpdateTaskRequest) => {
    try {
      // 更新確認を行う
      if (window.confirm('更新します。よろしいですか？')) {
        // タスクを更新する
        await taskApi.update(request)
        
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('タスクを更新しました')

        // タスク一覧画面に戻る
        router.push(`${TASKS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleUpdate }
}
