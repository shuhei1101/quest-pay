import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { publicQuestComments, profiles, icons, commentUpvotes, commentLikes, commentReports, PublicQuestSelect } from "@/drizzle/schema"
import { and, count, desc, eq, sql } from "drizzle-orm"

/** 公開クエストコメント取得結果 */
export type PublicQuestComment = {
  id: string
  publicQuestId: string
  profileId: string
  content: string
  createdAt: string
  updatedAt: string
  isPinned: boolean
  isLikedByPublisher: boolean
  profile: {
    id: string
    name: string
    iconId: number
    iconColor: string
    familyId: string
  }
  icon: {
    id: number
    name: string
  }
  upvoteCount: number
  downvoteCount: number
  isUpvoted: boolean
  isDownvoted: boolean
}

/** 公開クエストのコメント一覧を取得する */
export const fetchPublicQuestComments = async ({
  publicQuestId,
  db,
  profileId,
}: {
  publicQuestId: PublicQuestSelect["id"]
  db: Db
  profileId?: string
}) => {
  try {
    // コメント一覧を取得する
    const rows = await db
      .select({
        comment: publicQuestComments,
        profile: profiles,
        icon: icons,
      })
      .from(publicQuestComments)
      .innerJoin(profiles, eq(publicQuestComments.profileId, profiles.id))
      .innerJoin(icons, eq(profiles.iconId, icons.id))
      .where(eq(publicQuestComments.publicQuestId, publicQuestId))
      .orderBy(desc(publicQuestComments.isPinned), desc(publicQuestComments.createdAt))

    // 各コメントの評価数と自分の評価状態を取得する
    const commentsWithStats = await Promise.all(
      rows.map(async (row) => {
        const commentId = row.comment.id

        // 高評価数を取得する
        const [{ upvotes }] = await db
          .select({ upvotes: count() })
          .from(commentUpvotes)
          .where(
            and(
              eq(commentUpvotes.commentId, commentId),
              eq(commentUpvotes.type, "upvote")
            )
          )

        // 低評価数を取得する
        const [{ downvotes }] = await db
          .select({ downvotes: count() })
          .from(commentUpvotes)
          .where(
            and(
              eq(commentUpvotes.commentId, commentId),
              eq(commentUpvotes.type, "downvote")
            )
          )

        // 自分が高評価しているか確認する
        const isUpvoted = profileId
          ? (
              await db
                .select()
                .from(commentUpvotes)
                .where(
                  and(
                    eq(commentUpvotes.commentId, commentId),
                    eq(commentUpvotes.profileId, profileId),
                    eq(commentUpvotes.type, "upvote")
                  )
                )
            ).length > 0
          : false

        // 自分が低評価しているか確認する
        const isDownvoted = profileId
          ? (
              await db
                .select()
                .from(commentUpvotes)
                .where(
                  and(
                    eq(commentUpvotes.commentId, commentId),
                    eq(commentUpvotes.profileId, profileId),
                    eq(commentUpvotes.type, "downvote")
                  )
                )
            ).length > 0
          : false

        return {
          id: row.comment.id,
          publicQuestId: row.comment.publicQuestId,
          profileId: row.comment.profileId,
          content: row.comment.content,
          createdAt: row.comment.createdAt,
          updatedAt: row.comment.updatedAt,
          isPinned: row.comment.isPinned,
          isLikedByPublisher: row.comment.isLikedByPublisher,
          profile: {
            id: row.profile.id,
            name: row.profile.name,
            iconId: row.profile.iconId,
            iconColor: row.profile.iconColor,
            familyId: row.profile.familyId,
          },
          icon: {
            id: row.icon.id,
            name: row.icon.name,
          },
          upvoteCount: upvotes || 0,
          downvoteCount: downvotes || 0,
          isUpvoted,
          isDownvoted,
        }
      })
    )

    devLog("fetchPublicQuestComments.取得データ: ", commentsWithStats)

    return commentsWithStats
  } catch (error) {
    devLog("fetchPublicQuestComments.取得例外: ", error)
    throw new QueryError("コメントの読み込みに失敗しました。")
  }
}

/** 公開クエストのコメント数を取得する */
export const fetchPublicQuestCommentsCount = async ({
  publicQuestId,
  db,
}: {
  publicQuestId: PublicQuestSelect["id"]
  db: Db
}) => {
  try {
    const [{ total }] = await db
      .select({ total: count() })
      .from(publicQuestComments)
      .where(eq(publicQuestComments.publicQuestId, publicQuestId))

    devLog("fetchPublicQuestCommentsCount.取得データ: ", total)

    return total || 0
  } catch (error) {
    devLog("fetchPublicQuestCommentsCount.取得例外: ", error)
    throw new QueryError("コメント数の読み込みに失敗しました。")
  }
}
