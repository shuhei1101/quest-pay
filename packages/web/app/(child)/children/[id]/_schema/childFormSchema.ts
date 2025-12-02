import { z } from "zod";

/** 子供フォームスキーマ */
export const ChildFormSchema = z.object({
  /** 最低貯蓄額 */
  min_savings: z.number().optional(),
  /** 現在の貯金額 */
  current_savings: z.number().optional(),
  /** 現在のレベル */
  current_level: z.number().optional(),
  /** 累計獲得経験値 */
  total_exp: z.number().optional()
})

/** 子供フォームスキーマの型 */
export type ChildFormSchema = z.infer<typeof ChildFormSchema>;
