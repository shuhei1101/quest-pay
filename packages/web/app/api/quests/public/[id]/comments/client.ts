import { PUBLIC_QUEST_COMMENTS_API_URL } from "@/app/(core)/endpoints"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { GetPublicQuestCommentsResponse } from "./route"

/** コメント一覧を取得する */
export const getPublicQuestComments = async ({ publicQuestId }: { publicQuestId: string }) => {
  try {
    const response = await fetch(PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId))
    const data: GetPublicQuestCommentsResponse = await response.json()
    return data
  } catch (error) {
    handleAppError(error)
    throw error
  }
}
