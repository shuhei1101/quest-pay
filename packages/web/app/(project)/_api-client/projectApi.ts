import { handleAPIError } from "@/app/(core)/errorHandler";
import { ProjectFormSchema } from "../_schema/projectSchema";
import { RegisterProjectResponse } from "../projects/api/route";
import { PROJECT_API_URL } from "@/app/(core)/appConstants";

export const projectApi = {
  /** プロジェクトを作成する */
  create: async (project: ProjectFormSchema) => {
    const res = await fetch(`${PROJECT_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
    const data: RegisterProjectResponse = await res.json()

    return data.id
  },
  
  /** プロジェクトを更新する */
  update: async (project: ProjectFormSchema) => {
    const res = await fetch(`${PROJECT_API_URL}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
  
  /** プロジェクトを削除する */
  delete: async (project: ProjectFormSchema) => {
    const res = await fetch(`${PROJECT_API_URL}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
}
