"use client"

import { Button, Group } from "@mantine/core"
import { IconFileText, IconRefresh } from "@tabler/icons-react"

/** クエスト閲覧フッター（親向け） */
export const ParentChildQuestViewFooter = ({
  onReviewReport,
  onReset,
  isPendingReview,
}: {
  onReviewReport: () => void
  onReset: () => void
  isPendingReview: boolean
}) => {
  return (
    <Group justify="center" mt="xl" gap="md">
      {/* 報告内容確認ボタン（pending_reviewの場合のみ表示） */}
      {isPendingReview && (
        <Button
          size="md"
          color="blue"
          leftSection={<IconFileText size={18} />}
          onClick={onReviewReport}
        >
          報告内容確認
        </Button>
      )}

      {/* 進捗リセットボタン */}
      <Button
        size="md"
        variant="outline"
        color="red"
        leftSection={<IconRefresh size={18} />}
        onClick={onReset}
      >
        進捗リセット
      </Button>
    </Group>
  )
}
