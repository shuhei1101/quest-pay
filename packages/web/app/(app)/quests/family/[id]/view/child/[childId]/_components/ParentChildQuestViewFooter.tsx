"use client"

import { Button, Group } from "@mantine/core"
import { IconEdit, IconFileText } from "@tabler/icons-react"

/** クエスト閲覧フッター（親向け） */
export const ParentChildQuestViewFooter = ({
  onReviewReport,
  onEdit,
  isPendingReview,
}: {
  onReviewReport: () => void
  onEdit: () => void
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

      {/* 編集するボタン */}
      <Button
        size="md"
        variant="outline"
        leftSection={<IconEdit size={18} />}
        onClick={onEdit}
      >
        編集する
      </Button>
    </Group>
  )
}
