import { PUBLIC_QUEST_COMMENTS_COUNT_API_URL } from "@/app/(core)/endpoints"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { GetPublicQuestCommentsCountResponse } from "./route"

/** コメント数を取得する */
export const getPublicQuestCommentsCount = async ({ publicQuestId }: { publicQuestId: string }) => {
  try {
    const response = await fetch(PUBLIC_QUEST_COMMENTS_COUNT_API_URL(publicQuestId))
    const data: GetPublicQuestCommentsCountResponse = await response.json()
    return data
  } catch (error) {
    handleAppError(error)
    throw error
  }
}
