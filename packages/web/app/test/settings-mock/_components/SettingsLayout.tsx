"use client"

import { Box, Group, LoadingOverlay, Paper, Tabs, Title, Button } from "@mantine/core"
import { useState, ReactNode } from "react"
import { IconAlertCircle } from "@tabler/icons-react"

/** 設定画面レイアウトのタブ設定 */
type TabConfig = {
  /** タブの値 */
  value: string
  /** タブのラベル */
  label: string
  /** エラーがあるか */
  hasErrors?: boolean
  /** タブパネルの内容 */
  content: ReactNode
}

/** 設定画面レイアウトProps */
type SettingsLayoutProps = {
  /** タイトル */
  title: string
  /** データ取得中のローディング状態 */
  isLoading?: boolean
  /** タブ設定 */
  tabs: TabConfig[]
  /** 保存ボタンを表示するか */
  showSaveButton?: boolean
  /** フォーム送信時のハンドラ */
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>
  /** キャンセルボタンを表示するか */
  showCancelButton?: boolean
  /** キャンセル時のハンドラ */
  onCancel?: () => void
}

/** 設定画面レイアウトコンポーネント */
export const SettingsLayout = ({
  title,
  isLoading = false,
  tabs,
  showSaveButton = true,
  onSubmit,
  showCancelButton = false,
  onCancel,
}: SettingsLayoutProps) => {
  /** アクティブタブ状態 */
  const [activeTab, setActiveTab] = useState<string | null>(tabs[0]?.value ?? "profile")

  return (
    <Box pos="relative">
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* 設定フォーム */}
      <form onSubmit={onSubmit}>
        <Paper p="md" withBorder style={{ height: 'var(--content-height)', display: 'flex', flexDirection: 'column' }}>
          {/* タイトル */}
          <Title order={2} mb="md">
            {title}
          </Title>

          <Tabs value={activeTab} onChange={setActiveTab} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* タブリスト */}
            <Tabs.List>
              {tabs.map((tab) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  rightSection={tab.hasErrors ? <IconAlertCircle size={16} color="red" /> : null}
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {/* タブパネル */}
            {tabs.map((tab) => (
              <Tabs.Panel
                key={tab.value}
                value={tab.value}
                pt="xs"
                style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  overflowX: 'hidden' 
                }}
              >
                {tab.content}
              </Tabs.Panel>
            ))}
          </Tabs>

          {/* アクションボタン */}
          {(showSaveButton || showCancelButton) && (
            <Group mt="md" justify="flex-end" gap="xs">
              {showCancelButton && (
                <Button variant="default" onClick={onCancel}>
                  キャンセル
                </Button>
              )}
              {showSaveButton && (
                <Button type="submit">
                  保存
                </Button>
              )}
            </Group>
          )}
        </Paper>
      </form>
    </Box>
  )
}
