"use client"

import { Text } from "@mantine/core"

/** レベルアイコン（Lv表示） */
export const LevelIcon = ({ size = 20 }: { size?: number }) => {
  return (
    <Text
      fw={700}
      c="dark"
      style={{
        fontStyle: "italic",
        fontSize: size * 0.7,
        lineHeight: 1,
      }}
    >
      Lv
    </Text>
  )
}
