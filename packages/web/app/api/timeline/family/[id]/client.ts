import { FAMILY_TIMELINE_BY_ID_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"
import type { GetFamilyTimelinesResponse } from "../route"

/** 家族タイムラインを取得する */
export const fetchFamilyTimelines = async ({familyId}: {familyId: string}) => {
  
  const res = await fetch(FAMILY_TIMELINE_BY_ID_API_URL(familyId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  const data = await res.json()
  return data as GetFamilyTimelinesResponse
}
