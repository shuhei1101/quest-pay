import { ActionIcon, Anchor, Box, Group, Paper, Switch, Text } from "@mantine/core"
import { useState } from "react"
import { IconUser } from "@tabler/icons-react"

export const MockChildSettingsA = () => {
  // Mock data for demonstration
  const mockChildren = [
    { id: "1", name: "太郎", iconColor: "#FF6B6B" },
    { id: "2", name: "花子", iconColor: "#4ECDC4" },
    { id: "3", name: "次郎", iconColor: "#95E1D3" },
  ]

  return (
    <div className="flex flex-col gap-4 max-w-2xl p-4">
      <Text size="sm" c="dimmed">
        クエストを掲載する子供を選択してください。子供の名前をクリックすると、その子供のクエスト閲覧ページに遷移します。
      </Text>

      {mockChildren.map((child) => (
        <Paper key={child.id} p="md" withBorder>
          <Group justify="space-between" align="center">
            {/* 子供のアイコンと名前 */}
            <Group gap="md">
              <ActionIcon 
                size="lg" 
                radius="xl" 
                variant="filled"
                style={{ backgroundColor: child.iconColor }}
              >
                <IconUser size={20} />
              </ActionIcon>
              
              <Anchor 
                href={`/children/${child.id}`} 
                size="md"
                fw={500}
              >
                {child.name}
              </Anchor>
            </Group>

            {/* 公開フラグ */}
            <Switch 
              label="公開"
              labelPosition="left"
            />
          </Group>
        </Paper>
      ))}
    </div>
  )
}
