import { Paper, Text, Group } from "@mantine/core"

type PageTitleProps = {
  /** ページタイトル */
  title: string
  /** 右側に配置する要素 */
  rightSection?: React.ReactNode
}

/**
 * ページタイトルを表示する共通コンポーネント
 * Paperでラップしボーダーと影を付けて表示する
 */
export const PageTitle = ({ title, rightSection }: PageTitleProps) => {
  return (
    <Paper p="md" withBorder shadow="sm" mb="md">
      <Group justify="space-between" align="center">
        <Text size="xl" fw={700}>{title}</Text>
        {rightSection && <div>{rightSection}</div>}
      </Group>
    </Paper>
  )
}
