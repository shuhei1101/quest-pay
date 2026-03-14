import { PUBLIC_QUEST_COMMENTS_API_URL } from "@/app/(core)/endpoints"
import { GetPublicQuestCommentsResponse, PostPublicQuestCommentRequest } from "./route"
import { logger } from "@/app/(core)/logger"
import { AppError } from "@/app/(core)/error/appError"

/** コメント一覧を取得する */
export const getPublicQuestComments = async ({ publicQuestId }: { publicQuestId: string }) => {
  logger.debug("getPublicQuestComments.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId }) })
  
  const res = await fetch(PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  const data = await res.json()
  logger.debug("getPublicQuestComments.取得データ: ", { data })

  return data as GetPublicQuestCommentsResponse
}

/** コメントを投稿する */
export const postPublicQuestComment = async ({
  publicQuestId,
  content,
}: {
  publicQuestId: string
  content: string
}) => {
  logger.debug("postPublicQuestComment.API呼び出し: ", { URL: PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId }) })
  
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
