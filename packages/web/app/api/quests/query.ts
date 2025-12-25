import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { quests } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

/** クエストを取得する */
export const fetchQuest = async ({id, db}: {
  id: string,
  db: Db
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(quests)
      .where(eq(quests.id, id))
    return data[0]
  } catch (error) {
    devLog("fetchQuest.取得例外: ", error)
    throw new QueryError("クエスト情報の読み込みに失敗しました。")
  }
}
