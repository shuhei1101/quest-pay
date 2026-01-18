"use client"

import { Box, Button, Group, LoadingOverlay, Paper, Tabs } from "@mantine/core"
import { useState, ReactNode, useEffect } from "react"
import { IconAlertCircle } from "@tabler/icons-react"
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch, UseFormHandleSubmit } from "react-hook-form"

/** クエスト編集レイアウトのタブ設定 */
type TabConfig = {
  /** タブの値 */
  value: string
  /** タブのラベル */
  label: string
  /** エラーがあるか */
  hasErrors: boolean
  /** タブパネルの内容 */
  content: ReactNode
}

/** クエスト編集レイアウトのアクションボタン */
type ActionButton = {
  /** ボタンのラベル */
  label: string
  /** クリック時のハンドラ */
  onClick?: () => void
  /** フォーム送信ボタンかどうか */
  type?: "button" | "submit"
  /** ボタンの色 */
  color?: string
  /** ローディング状態 */
  loading?: boolean
  /** 無効状態 */
  disabled?: boolean
  /** 左側に配置するかどうか */
  alignLeft?: boolean
}

/** クエスト編集レイアウトProps */
type QuestEditLayoutProps<TForm extends Record<string, unknown>> = {
  /** クエストID（新規作成時はundefined） */
  questId?: string
  /** データ取得中のローディング状態 */
  isLoading: boolean
  /** フォーム送信時のハンドラ */
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  /** タブ設定 */
  tabs: TabConfig[]
  /** 編集モード時のアクションボタン */
  editActions: ActionButton[]
  /** 新規作成モード時のアクションボタン */
  createActions: ActionButton[]
  /** フローティングポップアップコンポーネント */
  popups?: ReactNode
}

/** クエスト編集レイアウトコンポーネント */
export const QuestEditLayout = <TForm extends Record<string, unknown>>({
  questId,
  isLoading,
  onSubmit,
  tabs,
  editActions,
  createActions,
  popups,
}: QuestEditLayoutProps<TForm>) => {
  /** アクティブタブ状態 */
  const [activeTab, setActiveTab] = useState<string | null>(tabs[0]?.value ?? "basic")

  /** 表示するアクションボタンを取得する */
  const actionButtons = questId ? editActions : createActions

  return (
    <>
      <Box pos="relative">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        {/* クエスト入力フォーム */}
        <form onSubmit={onSubmit}>
          <Paper p="md" withBorder style={{ height: 'calc(100vh - 60px - 2rem)', display: 'flex', flexDirection: 'column' }}>
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
                  style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}
                >
                  {tab.content}
                </Tabs.Panel>
              ))}
            </Tabs>

            {/* アクションボタン */}
            <Group mt="md" justify="space-between">
              {/* 左側のボタン */}
              <Group>
                {actionButtons.filter(action => action.alignLeft).map((action, index) => (
                  <Button
                    key={`left-${index}`}
                    type={action.type ?? "button"}
                    color={action.color}
                    loading={action.loading}
                    disabled={action.disabled}
                    onClick={action.type !== "submit" ? action.onClick : undefined}
                  >
                    {action.label}
                  </Button>
                ))}
              </Group>
              {/* 右側のボタン */}
              <Group>
                {actionButtons.filter(action => !action.alignLeft).map((action, index) => (
                  <Button
                    key={`right-${index}`}
                    type={action.type ?? "button"}
                    color={action.color}
                    loading={action.loading}
                    disabled={action.disabled}
                    onClick={action.type !== "submit" ? action.onClick : undefined}
                  >
                    {action.label}
                  </Button>
                ))}
              </Group>
            </Group>
          </Paper>
        </form>
      </Box>

      {/* フローティングポップアップ */}
      {popups}
    </>
  )
}
