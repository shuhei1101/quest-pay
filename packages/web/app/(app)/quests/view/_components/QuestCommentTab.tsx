"use client"

import { Box, Stack, Text, Center } from "@mantine/core"
import { PublicQuestComments } from "../../public/[id]/comments/PublicQuestComments"

/** コメントタブ */
export const QuestCommentTab = ( { id }: { id: string } ) => {
  return (
    <PublicQuestComments id={id} />
  )
}
