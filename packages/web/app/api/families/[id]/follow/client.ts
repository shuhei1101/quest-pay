import { logger } from "@/app/(core)/logger"
import { FAMILY_FOLLOW_API_URL, FAMILY_FOLLOW_STATUS_API_URL, FAMILY_FOLLOW_COUNT_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"

/** フォローを追加する */
export const postFollow = async ({familyId}: {familyId: string}) => {
  logger.debug("postFollow.API呼び出し: ", {URL: FAMILY_FOLLOW_API_URL(familyId })})
  
  const res = await fetch(FAMILY_FOLLOW_API_URL(familyId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}

/** フォローを解除する */
export const deleteFollow = async ({familyId}: {familyId: string}) => {
  logger.debug("deleteFollow.API呼び出し: ", {URL: FAMILY_FOLLOW_API_URL(familyId })})
  
  const res = await fetch(FAMILY_FOLLOW_API_URL(familyId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}

/** フォロー状態を取得する */
export const fetchFollowStatus = async ({familyId}: {familyId: string}): Promise<{isFollowing: boolean}> => {
  logger.debug("fetchFollowStatus.API呼び出し: ", {URL: FAMILY_FOLLOW_STATUS_API_URL(familyId })})
  
  const res = await fetch(FAMILY_FOLLOW_STATUS_API_URL(familyId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  return res.json()
}

/** フォロワー数とフォロー数を取得する */
export const fetchFollowCount = async ({familyId}: {familyId: string}): Promise<{followerCount: number, followingCount: number}> => {
  logger.debug("fetchFollowCount.API呼び出し: ", {URL: FAMILY_FOLLOW_COUNT_API_URL(familyId })})
  
  const res = await fetch(FAMILY_FOLLOW_COUNT_API_URL(familyId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  return res.json()
}
