"use client"

import { HOME_URL, QUESTS_URL, FAMILY_MEMBERS_URL } from '@/app/(core)/endpoints'
import { Box, ActionIcon } from '@mantine/core'
import { IconHome2, IconClipboard, IconUsers, IconMenu2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useLoginUserInfo } from '@/app/(auth)/login/_hooks/useLoginUserInfo'
import { menuColors } from '@/app/(core)/_theme/colors'

/** モバイル用ボトムバーを取得する */
export const BottomBar = ({isDark, onToggleMenu}: {isDark: boolean, onToggleMenu: () => void}) => {
  const router = useRouter()
  /** ログインユーザ情報 */
  const { isParent } = useLoginUserInfo()

  return (
    <Box
      style={{
        width: "100%",
        height: "70px",
        background: isDark ? "rgba(39, 39, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: isDark ? "0 -2px 6px rgba(0, 0, 0, 0.4)" : "0 -2px 6px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* ホームアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)} aria-label="ホーム">
        <IconHome2 color={menuColors.home} stroke={1.4} />
      </ActionIcon>
      {/* クエストアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(QUESTS_URL)} aria-label="クエスト">
        <IconClipboard color={menuColors.quest} stroke={1.4} />
      </ActionIcon>
      {/* メンバーアイコン（親のみ） */}
      {isParent && (
        <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_MEMBERS_URL)} aria-label="メンバー">
          <IconUsers color={menuColors.members} stroke={1.4} />
        </ActionIcon>
      )}
      {/* メニュー開閉ボタン */}
      <ActionIcon variant="subtle" onClick={onToggleMenu} aria-label="メニューを開く">
        <IconMenu2 color={isDark ? "white" : "black"} stroke={1.4} />
      </ActionIcon>
    </Box>
  )
}
