import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { devLog } from "@/app/(core)/util"
import { z } from "zod"

/** DBのクエストカテゴリスキーマ */
export const QuestCategoryEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  icon_name: z.string(),
  icon_size: z.number().nullable(),
  sort_order: z.number(),
  icon_color: z.string().nullable(),
})
export type QuestCategoryEntity = z.infer<typeof QuestCategoryEntitySchema>

// クエストカテゴリ辞書スキーマ
export const QuestCategoryByIdSchema = z.record(
  z.string(),
  z.custom<QuestCategoryEntity>()
)
export type QuestCategoryById = z.infer<typeof QuestCategoryByIdSchema>
export const createQuestCategoryById = (categories: QuestCategoryEntity[]) => {
  // セッションストレージから取得する
  let questCategoryById = appStorage.questCategoryById.get()
  devLog("クエストカテゴリ辞書取得: ", questCategoryById)
  // 取得できなかった場合
  if (!questCategoryById) {
    // 生成する
    questCategoryById = Object.fromEntries(
        categories.map(category => [String(category.id), category])
      ) as QuestCategoryById
    // セッションストレージに格納する
    appStorage.questCategoryById.set(questCategoryById)
  }
  return questCategoryById
}
