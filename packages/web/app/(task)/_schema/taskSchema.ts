import { z } from "zod";

/** DBのタスクスキーマ */
export const rawTask = z.object({
  id: z.number(),
  name: z.string(),
  detail: z.string(),
  status_id: z.number(),
  send_mail: z.boolean(),
  created_at: z.string(),
  updated_at: z.string()
})
export type RawTask = z.infer<typeof rawTask>

// 更新用
export type TaskInsert = Omit<RawTask, "id" | "created_at"| "updated_at">
export type TaskUpdate = Omit<RawTask, "created_at">
export type TaskDelete = Pick<RawTask, "id" | "updated_at">

// タスクのカラム名
export type TaskColumns = keyof RawTask;

/** タスクフォームスキーマ */
export const taskFormSchema = z.object({
  /** タスクID */
  id: z.number().optional(),
  /** タスク名 */
  name: z.string().nonempty({error: "タスク名は必須です。"}).min(3, { error: "タスク名は3文字以上で入力してください。"}).max(20, { error: "タスク名は20文字以下で入力してください。"}),
  /** タスク詳細 */
  detail: z.string().max(200, { error: "タスク詳細は200文字以下で入力してください。"}),
  /** タスクステータスID */
  status_id: z.number().optional(),
  /** メール送信フラグ */
  send_mail: z.boolean(),
  /** 作成日時 */
  created_at: z.string().optional(),
  /** 更新日時 */
  updated_at: z.string().optional()
}).refine((data) => data.status_id !== undefined, {
  message: "ステータスは必須です。",
  path: ["status_id"],
})

/** タスクフォームスキーマの型 */
export type TaskFormSchema = z.infer<typeof taskFormSchema>;

/** エンティティからタスクフォームスキーマを生成する */
export const createTaskSchemaFromEntity = (entity: RawTask): TaskFormSchema => {
  return {
    id: entity.id,
    name: entity.name,
    detail: entity.detail,
    send_mail: entity.send_mail,
    status_id: entity.status_id,
    created_at: entity.created_at,
    updated_at: entity.updated_at
  }
}

/** タスクフィルター */
export type TaskFilterSchema = Partial<Pick<RawTask, 
  "id" | "name" | "status_id"
>>

/** クエリオブジェクトからタスクフィルターに変換する */
export const createTaskFilterFromQueryObj = (queryObj: any) => {
  // クエリオブジェクトが空の場合はリターンする
  if (!queryObj) return {}

  const result: TaskFilterSchema = {}

  // IDをセットする
  result.id = queryObj.id ?? undefined
  // プロジェクト名をセットする
  result.name = queryObj.name ?? undefined
  // ステータスIDをセットする
  result.status_id = queryObj.status_id ?? undefined

  return result
}
