import { Card, Text, Group, Avatar } from "@mantine/core"
import { IconUser } from "@tabler/icons-react"

type TimelineItemProps = {
  profileName?: string | null
  profileIconColor?: string | null
  message: string
  createdAt: string
  type: string
}

/** 相対時刻を計算する */
const getRelativeTime = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return `${diffSec}秒前`
  if (diffMin < 60) return `${diffMin}分前`
  if (diffHour < 24) return `${diffHour}時間前`
  if (diffDay < 7) return `${diffDay}日前`
  return date.toLocaleDateString('ja-JP')
}

/** タイムラインアイテムコンポーネント */
export const TimelineItem = ({profileName, profileIconColor, message, createdAt, type}: TimelineItemProps) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      {/* タイムラインアイテムのコンテナ */}
      <Group>
        {/* アイコン表示 */}
        <Avatar color={profileIconColor || "blue"} radius="xl">
          <IconUser size={24} />
        </Avatar>
        {/* メッセージエリア */}
        <div style={{ flex: 1 }}>
          {/* ユーザ名 */}
          <Text size="sm" fw={600} c="dimmed">
            {profileName || "不明なユーザ"}
          </Text>
          {/* メッセージ */}
          <Text size="md" mt={4}>
            {message}
          </Text>
          {/* タイムスタンプ */}
          <Text size="xs" c="dimmed" mt={8}>
            {getRelativeTime(createdAt)}
          </Text>
        </div>
      </Group>
    </Card>
  )
}
