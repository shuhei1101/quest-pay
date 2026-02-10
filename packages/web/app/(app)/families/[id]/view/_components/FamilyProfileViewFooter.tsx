"use client"

import { Box, Button } from "@mantine/core"
import { IconSettings } from "@tabler/icons-react"

/** 家族プロフィール画面のフッタープロパティ */
type FamilyProfileViewFooterProps = {
  /** 設定ボタン押下時のハンドラ（オプション） */
  onSettings?: () => void
}

/** 家族プロフィール画面のフッター */
export const FamilyProfileViewFooter = ({
  onSettings,
}: FamilyProfileViewFooterProps) => {
  return (
    <Box className="flex items-center justify-center p-4">
      {/* 設定ボタン（オプション） */}
      {onSettings && (
        <Button
          variant="light"
          leftSection={<IconSettings size={20} />}
          onClick={onSettings}
          className="flex-shrink-0"
        >
          設定
        </Button>
      )}
    </Box>
  )
}
