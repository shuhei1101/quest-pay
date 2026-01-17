"use client"

import { ActionIcon, Avatar, Button, Center, Group, Indicator, Tooltip } from "@mantine/core"
import { IconCheck, IconHeart, IconHeartFilled, IconMessage, IconPlayerPlay, IconSend, IconX } from "@tabler/icons-react"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** 子供用クエストステータス */
export type ChildQuestStatus = 
  | "not_accepted"        // 未受注
  | "improvement_pending" // 改善要望中
  | "accepted"            // 受注中
  | "waiting_approval"    // 承認待ち
  | "cleared"             // クリア済み

// ===================================
// 子供用フッター（ステータス別ボタンセット）
// ===================================

/** 未受注時のボタンセット */
const FooterNotAccepted = ({
  onAccept,
  onImprovement,
}: {
  onAccept?: () => void
  onImprovement?: () => void
}) => {
  const { colors } = useTheme()
  
  return (
    <Group justify="center" mt="xl" gap="md">
      {/* クエストを受注するボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color={colors.buttonColors.primary}
        leftSection={<IconPlayerPlay size={18} />}
        onClick={onAccept}
      >
        クエストを受注する
      </Button>
      {/* 改善要望を送るボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color={colors.buttonColors.secondary}
        variant="outline"
        leftSection={<IconSend size={18} />}
        onClick={onImprovement}
      >
        改善要望を送る
      </Button>
    </Group>
  )
}

/** 改善要望中のボタンセット */
const FooterImprovementPending = () => {
  const { colors } = useTheme()
  
  return (
    <Center mt="xl">
      <Button 
        size="md" 
        radius="xl" 
        color={colors.buttonColors.default}
        disabled
      >
        改善要望中
      </Button>
    </Center>
  )
}

/** 受注中のボタンセット */
const FooterAccepted = ({
  currentCount,
  requiredCount,
  onComplete,
  onRetire,
}: {
  currentCount: number
  requiredCount: number
  onComplete?: () => void
  onRetire?: () => void
}) => {
  const { colors } = useTheme()
  
  return (
    <Group justify="center" mt="xl" gap="md">
      {/* 完了報告ボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color={colors.buttonColors.primary}
        leftSection={<IconCheck size={18} />}
        onClick={onComplete}
      >
        完了報告({currentCount}/{requiredCount})
      </Button>
      {/* リタイアボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color={colors.buttonColors.danger}
        variant="outline"
        leftSection={<IconX size={18} />}
        onClick={onRetire}
      >
        リタイア
      </Button>
    </Group>
  )
}

/** 承認待ちのボタンセット */
const FooterWaitingApproval = () => {
  const { colors } = useTheme()
  
  return (
    <Center mt="xl">
      <Button 
        size="md" 
        radius="xl" 
        color={colors.buttonColors.secondary}
        disabled
      >
        承認待ち
      </Button>
    </Center>
  )
}

/** クリア済みのボタンセット */
const FooterCleared = () => {
  const { colors } = useTheme()
  
  return (
    <Center mt="xl">
      <Button 
        size="md" 
        radius="xl" 
        color={colors.buttonColors.success}
        disabled
        leftSection={<IconCheck size={18} />}
      >
        クリア済み
      </Button>
    </Center>
  )
}

/** クエスト閲覧フッター（子供向け） */
export const ChildQuestViewFooter = ({
  status,
  currentCount = 0,
  requiredCount = 1,
  onAccept,
  onImprovement,
  onComplete,
  onRetire,
}: {
  status: ChildQuestStatus
  currentCount?: number
  requiredCount?: number
  onAccept?: () => void
  onImprovement?: () => void
  onComplete?: () => void
  onRetire?: () => void
}) => {
  switch (status) {
    case "not_accepted":
      return <FooterNotAccepted onAccept={onAccept} onImprovement={onImprovement} />
    case "improvement_pending":
      return <FooterImprovementPending />
    case "accepted":
      return <FooterAccepted currentCount={currentCount} requiredCount={requiredCount} onComplete={onComplete} onRetire={onRetire} />
    case "waiting_approval":
      return <FooterWaitingApproval />
    case "cleared":
      return <FooterCleared />
    default:
      return null
  }
}
