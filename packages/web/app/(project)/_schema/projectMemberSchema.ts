import { z } from "zod";

/** DBのプロジェクトメンバースキーマ */
export const rawProjectMember = z.object({
  project_id: z.number(),
  user_id: z.string(),
  created_at: z.string(),
})
export type RawProjectMember = z.infer<typeof rawProjectMember>

// 更新用
export type ProjectMemberInsert = Pick<RawProjectMember, "project_id" | "user_id">
export type ProjectMemberDelete = Pick<RawProjectMember, "project_id" | "user_id">
