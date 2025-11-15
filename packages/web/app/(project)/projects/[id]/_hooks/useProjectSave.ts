"use client"

import { useRouter } from "next/navigation"
import { projectApi } from "../../../_api-client/projectApi"
import { ProjectFormSchema } from "../../../_schema/projectSchema"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { handleAppError } from "@/app/(core)/errorHandler"
import { PROJECTS_URL } from "@/app/(core)/appConstants"

/** 新規作成ボタン押下時のハンドル */
export const useProjectSave = () => {
  const router = useRouter()
  const handleSave = async (project: ProjectFormSchema) => {
    try {
      // 登録確認を行う
      if (window.confirm('登録します。よろしいですか？')) {

        // プロジェクトを新規作成する
        const id = await projectApi.create(project)
    
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('プロジェクトを登録しました')
          
        // プロジェクト一覧画面に戻る
        router.push(`${PROJECTS_URL}`)
      }
    } catch (err) {
      handleAppError(err, router)
    }
  }
  return { handleSave }
}
