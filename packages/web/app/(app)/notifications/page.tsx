"use client"

import { Paper, Text } from "@mantine/core"

/** 通知画面（デフォルト表示） */
export default function Page() {
  return (
    <Paper p="xl" h="100%" className="flex items-center justify-center">
      <Text c="dimmed">通知を選択してください</Text>
    </Paper>
  )
}
