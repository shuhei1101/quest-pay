"use client"
import { z } from "zod"
import { handleAPIError } from "@/app/(core)/errorHandler";
import { FamilyDelete, FamilyEntitySchema, FamilyInsert, FamilyUpdate } from "../_schema/familyEntity";
import { FAMILY_API_URL } from "@/app/(core)/constants";
import { FamilyCreateRequest } from "../schema";
import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { handleAppError } from "@/app/(core)/errorHandler"
import { QUESTS_URL } from "@/app/(core)/constants"

export const familyApi = {
  /** 家族を取得する */
  get: async (id: string) => {
    const res = await fetch(`${FAMILY_API_URL}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      await handleAPIError(res)
    }

    // 取得データを返却する
    return z.array(FamilyEntitySchema).parse(res)
  },
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
