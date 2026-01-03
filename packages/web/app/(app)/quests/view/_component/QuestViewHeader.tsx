"use client"

import { useWindow } from "@/app/(core)/useConstants"
import { ActionIcon, Box, Group, Paper, Text } from "@mantine/core"

/** クエスト閲覧ヘッダー */
export const QuestViewHeader = ({ questName }: {
  questName: string
}) => {

  const {isDark} = useWindow()
  
  return (
    <Group justify="center" mb="md">
      {/* クエスト名 */}
      <Paper 
        px="xl" 
        py="xs" 
        radius="xl" 
        bg={isDark ? "blue.4": "blue.2"}
        style={{ flex: 1, maxWidth: 400, textAlign: "center"}}
      >
        <Text fw={600} size="lg">{questName}</Text>
      </Paper>
    </Group>
  )
}
