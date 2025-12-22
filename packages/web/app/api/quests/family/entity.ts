import { z } from "zod"

/** DBのクエストスキーマ */
export const FamilyQuestEntityScheme = z.object({
  id: z.string(),
  family_id: z.string(),
  is_public: z.boolean(),
  is_client_public: z.boolean(), // 依頼者氏名公開フラグ
  is_request_detail_public: z.boolean(), // 依頼詳細公開フラグ
  quest_id: z.string(),
})
export type FamilyQuestEntity = z.infer<typeof FamilyQuestEntityScheme>
