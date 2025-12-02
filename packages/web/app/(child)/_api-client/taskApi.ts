import { handleAPIError } from "@/app/(core)/errorHandler";
import { TASK_API_URL, TASK_FAMILY_API_URL } from "@/app/(core)/appConstants";
import { RegisterTaskRequest, UpdateTaskRequest } from "../children/api/schema";

export const taskApi = {
  /** タスクを作成する */
  create: async (request: RegisterTaskRequest) => {
    const res = await fetch(`${TASK_FAMILY_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
  
  /** タスクを更新する */
  update: async (request: UpdateTaskRequest) => {
    const res = await fetch(`${TASK_FAMILY_API_URL}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
  
  /** タスクを削除する */
  delete: async (task: TaskDelete) => {
    const res = await fetch(`${TASK_FAMILY_API_URL}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
}
