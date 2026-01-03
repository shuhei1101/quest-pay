"use client"

import { useWindow } from "@/app/(core)/useConstants"
import { Center, Paper } from "@mantine/core"
import { IconClipboardList } from "@tabler/icons-react"

/** クエストアイコン表示 */
export const QuestViewIcon = ({
  iconElement,
}: {
  iconElement?: React.ReactNode
}) => {

  const {isDark} = useWindow()
  
  return (
    <Center mb="md">
      <Paper 
        p="lg" 
        radius="md" 
        bg={isDark ? "gray.6" : "gray.3"}
        style={{ width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {iconElement ?? <IconClipboardList size={60} stroke={1.5} />}
      </Paper>
    </Center>
  )
}
