"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/errorHandler"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { PROJECTS_URL } from "@/app/(core)/appConstants"
import { ProjectFormSchema } from "@/app/(project)/_schema/projectSchema"
import { projectApi } from "@/app/(project)/_api-client/projectApi"

/** 更新ボタン押下時のハンドル */
export const useProjectUpdate = () => {
  const router = useRouter()
  const handleUpdate = async (project: ProjectFormSchema) => {
    try {
      // 更新確認を行う
      if (window.confirm('更新します。よろしいですか？')) {
          
        // プロジェクトを更新する
        await projectApi.update(project)
        
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('プロジェクトを更新しました')

        // プロジェクト一覧画面に戻る
        router.push(`${PROJECTS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleUpdate }
}
