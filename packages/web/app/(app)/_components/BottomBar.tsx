"use client"

import { HOME_URL, QUESTS_URL, FAMILY_MEMBERS_URL, FAMILY_QUESTS_URL } from '@/app/(core)/endpoints'
import { Box, ActionIcon } from '@mantine/core'
import { ClipboardIcon, HomeIcon, UsersIcon, WorldIcon } from '../../(core)/_components/icon'
import { useRouter } from 'next/navigation'

/** モバイル用ボトムバーを取得する */
export const BottomBar = ({isDark}: {isDark: boolean}) => {
  const router = useRouter()

  return (
    <Box
      style={{
        width: "100%",
        height: "60px",
        background: isDark ? "rgba(39, 39, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: isDark ? "0 -2px 6px rgba(0, 0, 0, 0.4)" : "0 -2px 6px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* ホームアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)}>
        <HomeIcon stroke={1.4} />
      </ActionIcon>
      {/* クエストアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_QUESTS_URL)}>
        <ClipboardIcon stroke={1.4} />
      </ActionIcon>
      {/* 地球アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(QUESTS_URL)}>
        <WorldIcon stroke={1.4} />
      </ActionIcon>
      {/* 人アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_MEMBERS_URL)}>
        <UsersIcon stroke={1.4} />
      </ActionIcon>
    </Box>
  )
}
