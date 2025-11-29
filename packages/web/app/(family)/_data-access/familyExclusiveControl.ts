import { DatabaseError } from "@/app/(core)/appError";
import { fetchFamily } from "../_query/familyQuery";

export const familyExclusiveControl = {
  /** 既に存在するかどうかを確認する */
  existsCheck: async (id: number) => {
    const record = await fetchFamily(id)
    if (!record) throw new DatabaseError("既に削除された家族です。")
    return record
  },
  /** 他のユーザに更新されたか確認する（更新日時による排他チェック） */
  hasAlreadyUpdated: ({beforeDate, afterDate}: {
    beforeDate: string,
    afterDate: string
  }) => {

    if (beforeDate !== afterDate) {
      // 排他例外を発生させる
      throw new DatabaseError("他のユーザによって更新されました。")
    }
  }
}
