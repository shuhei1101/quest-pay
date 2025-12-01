import { z } from "zod"

export const IdSchema = z.string().regex(/^[a-zA-Z0-9_]+$/, {
  message: "半角英数字とアンダースコアのみ使用可能です",
})
