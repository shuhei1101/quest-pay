import { handleAPIError } from "@/app/(core)/errorHandler";
import { FamilyDelete, FamilyInsert, FamilyUpdate } from "../_schema/familySchema";
import { FAMILY_API_URL } from "@/app/(core)/appConstants";
import { FamilyCreateRequest } from "../families/api/schema";

export const familyApi = {
  /** 家族を作成する */
  create: async (request: FamilyCreateRequest) => {
    const res = await fetch(`${FAMILY_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
  
  /** 家族を更新する */
  update: async (family: FamilyUpdate) => {
    const res = await fetch(`${FAMILY_API_URL}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(family)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
  
  /** 家族を削除する */
  delete: async (family: FamilyDelete) => {
    const res = await fetch(`${FAMILY_API_URL}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(family)
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }
  },
}
