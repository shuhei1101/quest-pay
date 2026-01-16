import { devLog } from "@/app/(core)/util"
import { ServerError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import {
  publicQuestComments,
  commentUpvotes,
  commentReports,
  PublicQuestSelect,
  ProfileSelect,
} from "@/drizzle/schema"
import { and, eq } from "drizzle-orm"

/** コメントを投稿する */
export const createPublicQuestComment = async ({
  publicQuestId,
  profileId,
  content,
  db,
}: {
  publicQuestId: PublicQuestSelect["id"]
  profileId: ProfileSelect["id"]
  content: string
  db: Db
}) => {
  try {
    const [result] = await db
      .insert(publicQuestComments)
      .values({
        publicQuestId,
        profileId,
        content,
      })
      .returning()

    devLog("createPublicQuestComment.作成データ: ", result)

    return result
  } catch (error) {
    devLog("createPublicQuestComment.作成例外: ", error)
    throw new ServerError("コメントの投稿に失敗しました。")
  }
}

/** コメントを削除する */
export const deletePublicQuestComment = async ({
  commentId,
  profileId,
  db,
}: {
  commentId: string
  profileId: ProfileSelect["id"]
  db: Db
}) => {
  try {
    // 自分のコメントかどうか確認する
    const [comment] = await db
      .select()
      .from(publicQuestComments)
      .where(
        and(
          eq(publicQuestComments.id, commentId),
          eq(publicQuestComments.profileId, profileId)
        )
      )

    if (!comment) {
      throw new ServerError("コメントが見つからないか、削除権限がありません。")
    }

    await db
      .delete(publicQuestComments)
      .where(eq(publicQuestComments.id, commentId))

    devLog("deletePublicQuestComment.削除完了: ", commentId)
  } catch (error) {
    devLog("deletePublicQuestComment.削除例外: ", error)
    throw new ServerError("コメントの削除に失敗しました。")
  }
}

/** コメントに高評価を付ける */
export const upvoteComment = async ({
  commentId,
  profileId,
  db,
}: {
  commentId: string
  profileId: ProfileSelect["id"]
  db: Db
}) => {
  try {
    // 既に評価しているか確認する
    const [existing] = await db
      .select()
      .from(commentUpvotes)
      .where(
        and(
          eq(commentUpvotes.commentId, commentId),
          eq(commentUpvotes.profileId, profileId)
        )
      )

    if (existing) {
      // 既に評価している場合は評価を更新する
      await db
        .update(commentUpvotes)
        .set({ type: "upvote" })
        .where(
          and(
            eq(commentUpvotes.commentId, commentId),
            eq(commentUpvotes.profileId, profileId)
          )
        )
    } else {
      // 評価していない場合は新規追加する
      await db.insert(commentUpvotes).values({
        commentId,
        profileId,
        type: "upvote",
      })
    }

    devLog("upvoteComment.高評価完了: ", commentId)
  } catch (error) {
    devLog("upvoteComment.高評価例外: ", error)
    throw new ServerError("高評価の登録に失敗しました。")
  }
}

/** コメントに低評価を付ける */
export const downvoteComment = async ({
  commentId,
  profileId,
  db,
}: {
  commentId: string
  profileId: ProfileSelect["id"]
  db: Db
}) => {
  try {
    // 既に評価しているか確認する
    const [existing] = await db
      .select()
      .from(commentUpvotes)
      .where(
        and(
          eq(commentUpvotes.commentId, commentId),
          eq(commentUpvotes.profileId, profileId)
        )
      )

    if (existing) {
      // 既に評価している場合は評価を更新する
      await db
        .update(commentUpvotes)
        .set({ type: "downvote" })
        .where(
          and(
            eq(commentUpvotes.commentId, commentId),
            eq(commentUpvotes.profileId, profileId)
          )
        )
    } else {
      // 評価していない場合は新規追加する
      await db.insert(commentUpvotes).values({
        commentId,
        profileId,
        type: "downvote",
      })
    }

    devLog("downvoteComment.低評価完了: ", commentId)
  } catch (error) {
    devLog("downvoteComment.低評価例外: ", error)
    throw new ServerError("低評価の登録に失敗しました。")
  }
}

/** コメント評価を削除する */
export const removeCommentVote = async ({
  commentId,
  profileId,
  db,
}: {
  commentId: string
  profileId: ProfileSelect["id"]
  db: Db
}) => {
  try {
    await db
      .delete(commentUpvotes)
      .where(
        and(
          eq(commentUpvotes.commentId, commentId),
          eq(commentUpvotes.profileId, profileId)
        )
      )

    devLog("removeCommentVote.評価削除完了: ", commentId)
  } catch (error) {
    devLog("removeCommentVote.評価削除例外: ", error)
    throw new ServerError("評価の削除に失敗しました。")
  }
}

/** コメントを報告する */
export const reportComment = async ({
  commentId,
  profileId,
  reason,
  db,
}: {
  commentId: string
  profileId: ProfileSelect["id"]
  reason: string
  db: Db
}) => {
  try {
    // 既に報告しているか確認する
    const [existing] = await db
      .select()
      .from(commentReports)
      .where(
        and(
          eq(commentReports.commentId, commentId),
          eq(commentReports.profileId, profileId)
        )
      )

    if (existing) {
      throw new ServerError("このコメントは既に報告済みです。")
    }

    await db.insert(commentReports).values({
      commentId,
      profileId,
      reason,
    })

    devLog("reportComment.報告完了: ", commentId)
  } catch (error) {
    devLog("reportComment.報告例外: ", error)
    if (error instanceof ServerError) throw error
    throw new ServerError("コメントの報告に失敗しました。")
  }
}
