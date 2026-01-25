"use client"

import { useWindow } from "@/app/(core)/useConstants"
import { Center, Paper } from "@mantine/core"
import { IconClipboardList } from "@tabler/icons-react"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { FaQuestion } from "react-icons/fa"

/** クエストアイコン表示 */
export const QuestViewIcon = ({
  iconName,
  iconSize,
  iconColor,
}: {
  iconName?: string
  iconSize?: number
  iconColor?: string
}) => {

  const {isDark} = useWindow()
  
  return (
    <Center mb="md">
      <Paper 
        p="lg" 
        radius="md" 
        bg={isDark ? "gray.6" : "gray.3"}
        style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {iconName ? (
          <RenderIcon 
            iconName={iconName}
            iconSize={iconSize ?? 48}
            iconColor={iconColor}
            size={48}
            stroke={1.5}
          />
        ) : (
          <FaQuestion size={48} />
        )}
      </Paper>
    </Center>
  )
}
