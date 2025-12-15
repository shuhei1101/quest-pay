import { z } from "zod"
const SortOrderArray = ['asc', 'desc'] as const
export const SortOrderScheme = z.enum(SortOrderArray)
export type SortOrder = z.infer<typeof SortOrderScheme>
