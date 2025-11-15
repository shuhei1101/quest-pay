import { z } from "zod";

/** ユーザタイプIDからタイプ名を取得する */
export const getTypeName = (types: RawUserType[], id?: number) => {
  return types.find(s => s.id === id)?.name
}

/** 取得時のタイプスキーマ */
export const rawUserType
 = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string(),
})
export type RawUserType = z.infer<typeof rawUserType>
