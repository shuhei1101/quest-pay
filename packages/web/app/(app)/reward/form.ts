import { z } from "zod"

/** 年齢別報酬フォームスキーマ */
export const AgeRewardFormSchema = z.object({
  rewards: z.array(
    z.object({
      age: z.number().int().min(0).max(100),
      amount: z.number().int().min(0)
    })
  )
})

export type AgeRewardFormType = z.infer<typeof AgeRewardFormSchema>

/** レベル別報酬フォームスキーマ */
export const LevelRewardFormSchema = z.object({
  rewards: z.array(
    z.object({
      level: z.number().int().min(1).max(100),
      amount: z.number().int().min(0)
    })
  )
})

export type LevelRewardFormType = z.infer<typeof LevelRewardFormSchema>
