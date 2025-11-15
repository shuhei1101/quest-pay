"use client"

import { useRouter } from "next/navigation"
import { taskApi } from "../../../_api-client/taskApi"
import { TaskFormSchema } from "../../../_schema/taskSchema"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { handleAppError } from "@/app/(core)/errorHandler"
import { TASKS_URL } from "@/app/(core)/appConstants"

/** 新規作成ボタン押下時のハンドル */
export const useTaskSave = () => {
  const router = useRouter()
  const handleSave = async (task: TaskFormSchema) => {
    try {
      // 登録確認を行う
      if (window.confirm('登録します。よろしいですか？')) {
        // タスクを新規作成する
        const id = await taskApi.create(task)
    
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('タスクを登録しました')
          
        // タスク一覧画面に戻る
        router.push(`${TASKS_URL}`)
      }
    } catch (err) {
      handleAppError(err, router)
    }
  }
  return { handleSave }
}
