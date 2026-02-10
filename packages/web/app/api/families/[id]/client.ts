import { devLog } from "@/app/(core)/util"
import { FAMILY_DETAIL_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"

type FamilyDetail = {
  family: {
    id: string
    displayId: string
    localName: string
    onlineName: string | null
    introduction: string
    iconId: number
    iconColor: string
  }
  icon: {
    name: string
    size: number | null
  } | null
  stats: {
    publicQuestCount: number
    likeCount: number
  }
  followCount: {
    followerCount: number
    followingCount: number
  }
}

/** 家族詳細情報を取得する */
export const fetchFamilyDetail = async ({familyId}: {familyId: string}): Promise<FamilyDetail> => {
  devLog("fetchFamilyDetail.API呼び出し: ", {URL: FAMILY_DETAIL_API_URL(familyId)})
  
  const res = await fetch(FAMILY_DETAIL_API_URL(familyId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  return res.json()
}
