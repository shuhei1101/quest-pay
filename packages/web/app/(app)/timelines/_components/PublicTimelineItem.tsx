import { Card, Text, Group, Avatar } from "@mantine/core"
import { IconHome2 } from "@tabler/icons-react"
import { getRelativeTime } from "../_utils/timeUtils"

type PublicTimelineItemProps = {
  familyOnlineName?: string | null
  familyIconColor?: string | null
  message: string
  createdAt: string
}

/** 公開タイムラインアイテムコンポーネント */
export const PublicTimelineItem = ({familyOnlineName, familyIconColor, message, createdAt}: PublicTimelineItemProps) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      {/* タイムラインアイテムのコンテナ */}
      <Group>
        {/* アイコン表示 */}
        <Avatar color={familyIconColor || "blue"} radius="xl">
          <IconHome2 size={24} />
        </Avatar>
        {/* メッセージエリア */}
        <div style={{ flex: 1 }}>
          {/* 家族名 */}
          <Text size="sm" fw={600} c="dimmed">
            {familyOnlineName || "不明な家族"}
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
