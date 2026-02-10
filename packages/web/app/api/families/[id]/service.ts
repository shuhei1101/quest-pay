import { Db } from "@/index"
import { fetchFamily, fetchFamilyStats } from "../query"
import { fetchFollowCount } from "./follow/query"
import { AppError } from "@/app/(core)/error/appError"

/** 家族詳細情報の型 */
export type FamilyDetailResponse = {
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
export const fetchFamilyDetail = async ({db, familyId}: {
  db: Db
  familyId: string
}): Promise<FamilyDetailResponse> => {
  // 家族情報を取得する
  const familyData = await fetchFamily({ db, familyId })
  if (!familyData?.families) {
    throw new AppError("NOT_FOUND", 404, "家族が見つかりません。")
  }

  // 統計情報を取得する
  const stats = await fetchFamilyStats({ db, familyId })

  // フォロー数を取得する
  const followCount = await fetchFollowCount({ db, familyId })

  return {
    family: {
      id: familyData.families.id,
      displayId: familyData.families.displayId,
      localName: familyData.families.localName,
      onlineName: familyData.families.onlineName,
      introduction: familyData.families.introduction,
      iconId: familyData.families.iconId,
      iconColor: familyData.families.iconColor,
    },
    icon: familyData.icons ? {
      name: familyData.icons.name,
      size: familyData.icons.size,
    } : null,
    stats,
    followCount,
  }
}
