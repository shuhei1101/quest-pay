"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/errorHandler"
import { projectApi } from "../../../_api-client/projectApi"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { PROJECTS_URL } from "@/app/(core)/appConstants"
import { ProjectFormSchema } from "@/app/(project)/_schema/projectSchema"

/** 削除ボタン押下時のハンドル */
export const useProjectDelete = () => {
  const router = useRouter()
  const handleDelete = async (project: ProjectFormSchema) => {
    try {
      // 削除確認を行う
      if (window.confirm('削除します。よろしいですか？')) {
        // プロジェクトを削除する
        await projectApi.delete(project)

        // 前画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('プロジェクトを削除しました')
          
        // プロジェクト一覧画面に戻る
        router.push(`${PROJECTS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleDelete }
}
