import z from "zod"

/** 家族クエストフィルター */
export const FamilyQuestFilterScheme = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
})
export type FamilyQuestFilterType = z.infer<typeof FamilyQuestFilterScheme>
