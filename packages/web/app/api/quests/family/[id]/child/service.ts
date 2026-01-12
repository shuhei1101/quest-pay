import { FamilyQuestSelect } from "@/drizzle/schema"
import { fetchChildQuest } from "./query"
import { getAuthContext } from "@/app/(core)/_auth/withAuth"
import { fetchUserInfoByUserId } from "../../../../users/query"


/** 子供クエストの編集権限を確認する */
export const hasChildQuestPermission = async ({ familyQuestId }: {
  familyQuestId: FamilyQuestSelect["id"]
}) => {
    // 認証コンテキストを取得する
    const { db, userId } = await getAuthContext()
    // プロフィール情報を取得する
    const userInfo = await fetchUserInfoByUserId({userId, db})
    // 子供クエストを取得する
    const childQuest = await fetchChildQuest({ db, familyQuestId: familyQuestId, childId: userInfo?.children?.id || "" })
    // 家族IDが一致するか確認する
    return childQuest?.base.familyId === userInfo.profiles.familyId
}
