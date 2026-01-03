"use client"

import { Button, Group } from "@mantine/core"
import { IconArrowLeft, IconEdit } from "@tabler/icons-react"

/** クエスト閲覧フッター（親向け） */
export const ParentQuestViewFooter = ({
  onEdit,
  onBack,
}: {
  onEdit?: () => void
  onBack?: () => void
}) => {
  return (
    <Group justify="center" mt="xl" gap="md">
      {/* 編集するボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color="blue"
        leftSection={<IconEdit size={18} />}
        onClick={onEdit}
      >
        編集する
      </Button>
      {/* 戻るボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color="gray"
        variant="outline"
        leftSection={<IconArrowLeft size={18} />}
        onClick={onBack}
      >
        戻る
      </Button>
    </Group>
  )
}
