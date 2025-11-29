import { RawUser, RawUser } from "@/app/(user)/_schema/userSchema";
import { z } from "zod";
import { FetchProjectResult } from "../_query/projectQuery";

/** DBのプロジェクトスキーマ */
export const rawProject = z.object({
  id: z.number(),
  name: z.string(),
  detail: z.string(),
  is_public: z.boolean(),
  created_at: z.string(),
  updated_at: z.string()
})
export type RawProject = z.infer<typeof rawProject>

// 更新用
export type ProjectInsert = Omit<RawProject, "id" | "created_at"| "updated_at"> & {
  user_ids: string[];
};
export type ProjectUpdate = Omit<RawProject, "created_at"> & {
  user_ids: string[];
};
export type ProjectDelete = Pick<RawProject, "id" | "updated_at">

// プロジェクトのカラム名
export type ProjectColumns = keyof RawProject;

/** プロジェクトフォームスキーマ */
export const projectFormSchema = z.object({
  /** プロジェクトID */
  id: z.number().optional(),
  /** プロジェクト名 */
  name: z.string().nonempty({error: "プロジェクト名は必須です。"}).min(3, { error: "プロジェクト名は3文字以上で入力してください。"}).max(20, { error: "プロジェクト名は20文字以下で入力してください。"}),
  /** プロジェクト詳細 */
  detail: z.string().max(200, { error: "プロジェクト詳細は200文字以下で入力してください。"}),
  /** 公開フラグ */
  is_public: z.boolean(),
  /** プロジェクトメンバーのID */
  members: z.array(RawUser).min(1, {
    message: "プロジェクトには最低1人のメンバーが必要です。"
  }),
  /** 作成日時 */
  created_at: z.string().optional(),
  /** 更新日時 */
  updated_at: z.string().optional()
})

/** プロジェクトフォームスキーマの型 */
export type ProjectFormSchema = z.infer<typeof projectFormSchema>;

/** プロジェクトフィルター */
export type ProjectFilterSchema = Partial<Pick<FetchProjectResult, 
  "id" | "name"
>>

/** クエリオブジェクトからプロジェクトフィルターに変換する */
export const createProjectFilterFromQueryObj = (queryObj: any) => {
  // クエリオブジェクトが空の場合はリターンする
  if (!queryObj) return {}

  const result: ProjectFilterSchema = {}

  // IDをセットする
  result.id = queryObj.id ?? undefined
  // プロジェクト名をセットする
  result.name = queryObj.name ?? undefined
  
  return result
}
