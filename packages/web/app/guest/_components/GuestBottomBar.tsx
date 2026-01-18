"use client"

import { HOME_URL, GUEST_QUESTS_URL, LOGIN_URL } from '@/app/(core)/endpoints'
import { Box, ActionIcon } from '@mantine/core'
import { HomeIcon, WorldIcon } from '../../(core)/_components/icon'
import { IconLogin } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

/** ゲスト用モバイルボトムバーを取得する */
export const GuestBottomBar = () => {
  const router = useRouter()

  return (
    <Box
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "60px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.15)",
        zIndex: 2000,
      }}
    >
      {/* ホームアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)}>
        <HomeIcon stroke={1.4} />
      </ActionIcon>
      {/* 公開クエストアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(GUEST_QUESTS_URL)}>
        <WorldIcon stroke={1.4} />
      </ActionIcon>
      {/* ログインアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(LOGIN_URL)}>
        <IconLogin stroke={1.4} />
      </ActionIcon>
    </Box>
  )
}
