"use client"

import { Box, Title, Text, Stack, Paper, Avatar, TextInput, Textarea, Button, Group } from "@mantine/core"
import { IconUser, IconCamera } from "@tabler/icons-react"
import { useState } from "react"

/** プロフィール設定詳細ページ */
export default function ProfileSettingPage() {
  const [name, setName] = useState("山田太郎")
  const [bio, setBio] = useState("お小遣いクエストを楽しんでいます！")

  return (
    <Box p="md">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Box>
          <Title order={2} size="h3" mb="xs">
            プロフィール設定
          </Title>
          <Text size="sm" c="dimmed">
            名前、アイコン、自己紹介を編集できます
          </Text>
        </Box>

        {/* アイコン変更 */}
        <Paper p="lg" withBorder>
          <Stack gap="md" align="center">
            <Box style={{ position: "relative" }}>
              <Avatar size={120} radius="xl">
                <IconUser size={60} />
              </Avatar>
              <Button
                size="xs"
                radius="xl"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
                leftSection={<IconCamera size={16} />}
              >
                変更
              </Button>
            </Box>
            <Text size="sm" c="dimmed">
              クリックしてプロフィール画像を変更
            </Text>
          </Stack>
        </Paper>

        {/* 基本情報 */}
        <Paper p="lg" withBorder>
          <Stack gap="md">
            <TextInput
              label="名前"
              description="あなたの表示名"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
            />
            
            <Textarea
              label="自己紹介"
              description="あなたについて教えてください（任意）"
              value={bio}
              onChange={(e) => setBio(e.currentTarget.value)}
              minRows={4}
              maxRows={6}
            />
          </Stack>
        </Paper>

        {/* 保存ボタン */}
        <Group justify="flex-end">
          <Button variant="default">
            キャンセル
          </Button>
          <Button>
            保存する
          </Button>
        </Group>
      </Stack>
    </Box>
  )
}
