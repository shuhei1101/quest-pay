import { FAMILY_PROFILE_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"
import { GetFamilyProfileResponse } from "./route"

/** 家族プロフィール情報を取得する */
export const getFamilyProfile = async ({familyId}: {
  familyId: string
}) => {
  const response = await fetch(FAMILY_PROFILE_API_URL(familyId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await response.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!response.ok) {
    throw AppError.fromResponse(data, response.status)
  }

  return data as GetFamilyProfileResponse
}
