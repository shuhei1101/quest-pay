"use client"

import { HOME_URL, QUESTS_URL, FAMILY_MEMBERS_URL, SETTINGS_URL } from '@/app/(core)/endpoints'
import { Box, ActionIcon } from '@mantine/core'
import { IconHome2, IconClipboard, IconUsers, IconSettings } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useLoginUserInfo } from '@/app/(auth)/login/_hooks/useLoginUserInfo'
import { menuColors } from '@/app/(core)/_theme/colors'

/** モバイル用ボトムバーを取得する */
export const BottomBar = () => {
  const router = useRouter()
  /** ログインユーザ情報 */
  const { isParent } = useLoginUserInfo()

  return (
    <Box
      style={{
        width: "100%",
        height: "70px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* ホームアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)}>
        <IconHome2 color={menuColors.home} stroke={1.4} />
      </ActionIcon>
      {/* クエストアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(QUESTS_URL)}>
        <IconClipboard color={menuColors.quest} stroke={1.4} />
      </ActionIcon>
      {/* メンバーアイコン（親のみ） */}
      {isParent && (
        <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_MEMBERS_URL)}>
          <IconUsers color={menuColors.members} stroke={1.4} />
        </ActionIcon>
      )}
      {/* 設定アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(SETTINGS_URL)}>
        <IconSettings color={menuColors.settings} stroke={1.4} />
      </ActionIcon>
    </Box>
  )
}
