"use client"

import { Box, Button } from "@mantine/core"
import { IconX, IconSettings } from "@tabler/icons-react"

/** 家族プロフィール画面のフッタープロパティ */
type FamilyProfileViewFooterProps = {
  /** 戻るボタン押下時のハンドラ */
  onBack: () => void
  /** 設定ボタン押下時のハンドラ（オプション） */
  onSettings?: () => void
}

/** 家族プロフィール画面のフッター */
export const FamilyProfileViewFooter = ({
  onBack,
  onSettings,
}: FamilyProfileViewFooterProps) => {
  return (
    <Box className="flex items-center justify-between p-4">
      {/* 戻るボタン */}
      <Button
        variant="subtle"
        leftSection={<IconX size={20} />}
        onClick={onBack}
        className="flex-shrink-0"
      >
        閉じる
      </Button>

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
