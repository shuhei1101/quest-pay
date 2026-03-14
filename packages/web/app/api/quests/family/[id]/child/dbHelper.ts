import { DatabaseError } from "@/app/(core)/error/appError"
import { fetchChildQuest } from "./query"
import { Db } from "@/index"
import { ChildSelect } from "@/drizzle/schema"
import { logger } from "@/app/(core)/logger"

export const questChildExclusiveControl = {
  /** 既に存在するかどうかを確認する */
  existsCheck: async ({familyQuestId, db, childId}: {
    familyQuestId: string,
    db: Db,
    childId: ChildSelect["id"]
  }) => {
    const record = await fetchChildQuest({familyQuestId, db, childId})
    if (!record) throw new DatabaseError("既に削除された子供クエストです。")
    return record
  },
  /** 他のユーザに更新されたか確認する（更新日時による排他チェック） */
  hasAlreadyUpdated: ({beforeDate, afterDate}: {
    beforeDate: string,
    afterDate: string
  }) => {

    if (beforeDate !== afterDate) {
      logger.error("排他エラー発生: ", {beforeDate, afterDate} })
      // 排他例外を発生させる
      throw new DatabaseError("他のユーザによって更新されました。")
    }
  }
}
