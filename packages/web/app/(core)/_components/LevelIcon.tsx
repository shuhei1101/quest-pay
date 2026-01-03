"use client"

import { Text } from "@mantine/core"
import { useWindow } from "../useConstants"

/** レベルアイコン（Lv表示） */
export const LevelIcon = ({ size = 20 }: { size?: number }) => {

  const {isDark} = useWindow()

  return (
    <Text
      fw={700}
      c={isDark ? "dark.0" : "dark"}
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
