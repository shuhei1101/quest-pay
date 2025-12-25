import { DatabaseError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { fetchQuest } from "./query"

export const questExclusiveControl = {
  /** 既に存在するかどうかを確認する */
  existsCheck: async ({id, db}: {
    id: string, 
    db: Db
  }) => {
    const record = await fetchQuest({id, db})
    if (!record) throw new DatabaseError("既に削除されたクエストです。")
    return record
  },
  /** 他のクエストに更新されたか確認する（更新日時による排他チェック） */
  hasAlreadyUpdated: ({beforeDate, afterDate}: {
    beforeDate: string,
    afterDate: string
  }) => {

    if (beforeDate !== afterDate) {
      // 排他例外を発生させる
      throw new DatabaseError("他のクエストによって更新されました。")
    }
  }
}
