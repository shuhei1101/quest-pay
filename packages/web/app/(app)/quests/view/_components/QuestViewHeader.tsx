"use client"

import { useWindow } from "@/app/(core)/useConstants"
import { ActionIcon, Box, Group, Paper, Text } from "@mantine/core"

/** クエスト閲覧ヘッダー */
export const QuestViewHeader = ({ questName, headerColor }: {
  questName: string
  headerColor?: { light: string, dark: string }
}) => {

  const {isDark} = useWindow()
  
  const defaultColor = { light: "blue.2", dark: "blue.4" }
  const color = headerColor || defaultColor
  
  return (
    <Group justify="center" mb="md">
      {/* クエスト名 */}
      <Paper 
        px="xl" 
        py="xs" 
        radius="xl" 
        bg={isDark ? color.dark : color.light}
        style={{ flex: 1, maxWidth: 400, textAlign: "center"}}
      >
        <Text fw={600} size="lg">{questName}</Text>
      </Paper>
    </Group>
  )
}
