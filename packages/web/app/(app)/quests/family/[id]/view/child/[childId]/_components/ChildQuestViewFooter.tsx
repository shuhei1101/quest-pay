"use client"

import { Button, Group } from "@mantine/core"
import { IconArrowLeft, IconEdit } from "@tabler/icons-react"
import { ChildQuest } from "@/app/api/quests/family/[id]/child/query"
import { QuestDetailSelect } from "@/drizzle/schema"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** クエスト閲覧フッター（子供向け） */
export const ChildQuestViewFooter = ({
  onBack,
  onReviewRequest,
  quest,
  currentDetail,
  onCancelReview
}: {
  onBack?: () => void
  onReviewRequest: () => void
  quest?: ChildQuest
  currentDetail?: QuestDetailSelect
  onCancelReview: () => void
}) => {
  const { colors } = useTheme()
  
  return (
    <Group justify="center" mt="xl" gap="md">
      {/* クリア済みボタン */}
      {quest?.children[0].status === "completed" && (
        <Button 
          size="md" 
          radius="xl" 
          color={colors.buttonColors.success}
          variant="outline"
          leftSection={<IconEdit size={18} />}
        >
          クリア済み
        </Button>
      )}
      {/* 承認待ちボタン */}
      {quest?.children[0].status === "pending_review" && (
        <Button 
          size="md" 
          radius="xl" 
          color={colors.buttonColors.secondary}
          variant="outline"
          onClick={onCancelReview}
        >
          承認待ち
        </Button>
      )}
      {/* 完了報告ボタン */}
      {quest?.children[0].status === "in_progress" && (
        <Button 
          size="md" 
          radius="xl" 
          color={colors.buttonColors.primary}
          variant="outline"
          leftSection={<IconEdit size={18} />}
          onClick={onReviewRequest}
        >
          完了報告をする{`(${quest.children[0].currentCompletionCount || 0}/${currentDetail?.requiredCompletionCount || 0})`}
        </Button>
      )}
      {/* リタイアボタン */}
      {/* {quest?.children[0].status === "in_progress" && (
        <Button 
          size="md" 
          radius="xl" 
          color={colors.buttonColors.danger}
          variant="outline"
          leftSection={<IconEdit size={18} />}
        >
          リタイアする
        </Button>
      )} */}
      {/* 戻るボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color={colors.buttonColors.default}
        variant="outline"
        leftSection={<IconArrowLeft size={18} />}
        onClick={onBack}
      >
        戻る
      </Button>
    </Group>
  )
}
