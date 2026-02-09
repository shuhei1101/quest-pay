import { Card, Text, Group, Avatar } from "@mantine/core"
import { IconUser } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { getRelativeTime } from "../_utils/timeUtils"

type TimelineItemProps = {
  profileName?: string | null
  profileIconColor?: string | null
  message: string
  createdAt: string
  url?: string | null
}

/** タイムラインアイテムコンポーネント */
export const TimelineItem = ({profileName, profileIconColor, message, createdAt, url}: TimelineItemProps) => {
  const router = useRouter()

  /** クリック時の処理 */
  const handleClick = () => {
    if (url) {
      router.push(url)
    }
  }

  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder
      style={{ cursor: url ? "pointer" : "default" }}
      onClick={handleClick}
    >
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
