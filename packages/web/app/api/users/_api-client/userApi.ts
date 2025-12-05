import { handleAPIError } from "@/app/(core)/errorHandler";
import { UserFormSchema } from "../entity";
import { USER_API_URL } from "@/app/(core)/constants";
import { RegisterUserResponse } from "../../../users/[id]/api/route";

export const userApi = {
  /** ユーザを作成する */
  create: async (user: UserFormSchema) => {
    const res = await fetch(`${USER_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
    const data: RegisterUserResponse = await res.json()

    return data.id
  },
  
  /** ユーザを更新する */
  update: async (user: UserFormSchema) => {
    const res = await fetch(`${USER_API_URL}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
  
  /** ユーザを削除する */
  delete: async (user: UserFormSchema) => {
    const res = await fetch(`${USER_API_URL}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
}
