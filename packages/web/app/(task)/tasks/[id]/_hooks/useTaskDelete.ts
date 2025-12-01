"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/errorHandler"
import { taskApi } from "../../../_api-client/taskApi"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { TASKS_URL } from "@/app/(core)/appConstants"
import { TaskDelete } from "@/app/(task)/_schema/taskEntity"

/** 削除ボタン押下時のハンドル */
export const useTaskDelete = () => {
  const router = useRouter()
  const handleDelete = async (task: TaskDelete) => {
    try {
      // 削除確認を行う
      if (window.confirm('削除します。よろしいですか？')) {

        // タスクを削除する
        await taskApi.delete(task)

        // 前画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('タスクを削除しました')
          
        // タスク一覧画面に戻る
        router.push(`${TASKS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleDelete }
}
