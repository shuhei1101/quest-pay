"use client"

import { Button } from "@mantine/core"
import { IconEdit, IconFileText, IconRefresh } from "@tabler/icons-react"
import { HorizontalScrollButtons } from "@/app/(core)/_components/HorizontalScrollButtons"

/** クエスト閲覧フッター（親向け） */
export const ParentChildQuestViewFooter = ({
  onReviewReport,
  onEdit,
  onReset,
  isPendingReview,
}: {
  onReviewReport: () => void
  onEdit: () => void
  onReset: () => void
  isPendingReview: boolean
}) => {
  return (
    <HorizontalScrollButtons justify="center" mt="xl" gap="md">
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
    </HorizontalScrollButtons>
  )
}
