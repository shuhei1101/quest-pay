import { PUBLIC_QUEST_COMMENTS_API_URL } from "@/app/(core)/endpoints"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { GetPublicQuestCommentsResponse, PostPublicQuestCommentRequest } from "./route"
import { devLog } from "@/app/(core)/util"
import { AppError } from "@/app/(core)/error/appError"

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

/** コメントを投稿する */
export const postComment = async ({
  publicQuestId,
  content,
}: {
  publicQuestId: string
  content: string
}) => {
  devLog("postComment.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content } as PostPublicQuestCommentRequest),
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}

