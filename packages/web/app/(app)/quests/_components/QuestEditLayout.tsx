"use client"

import { Group, LoadingOverlay, Tabs } from "@mantine/core"
import { useState, ReactNode } from "react"
import { IconAlertCircle } from "@tabler/icons-react"
import { FloatingActionItem } from "@/app/(core)/_components/FloatingActionButton"
import { SubMenuFAB } from "@/app/(core)/_components/SubMenuFAB"
import { useWindow } from "@/app/(core)/useConstants"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { PageHeader } from "@/app/(core)/_components/PageHeader"

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
  editActions: ReactNode[]
  /** 新規作成モード時のアクションボタン */
  createActions: ReactNode[]
  /** 編集モード時のFABアクション */
  fabEditActions?: FloatingActionItem[]
  /** 新規作成モード時のFABアクション */
  fabCreateActions?: FloatingActionItem[]
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
  fabEditActions = [],
  fabCreateActions = [],
  popups,
}: QuestEditLayoutProps<TForm>) => {
  /** アクティブタブ状態 */
  const [activeTab, setActiveTab] = useState<string | null>(tabs[0]?.value ?? "basic")
  
  /** モバイル判定 */
  const { isMobile } = useWindow()

  /** 表示するアクションボタンを取得する */
  const actionButtons = questId ? editActions : createActions
  
  /** 表示するFABアクションを取得する */
  const fabActions = questId ? fabEditActions : fabCreateActions

  return (
    <>
      {/* ページタイトル */}
      <PageHeader 
        title={questId ? "クエスト編集" : "クエスト登録"}
        showProfileButton={false}
      />

      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* クエスト入力フォーム */}
      <form onSubmit={onSubmit} style={{ height: 'var(--content-height)', display: 'flex', flexDirection: 'column' }}>
        <ScrollableTabs 
          activeTab={activeTab} 
          onChange={setActiveTab}
          tabs={tabs.map((tab) => ({
            value: tab.value,
            label: tab.label,
            rightSection: tab.hasErrors ? <IconAlertCircle size={16} color="red" /> : null
          }))}
        >
          {/* タブパネル */}
          {tabs.map((tab) => (
            <Tabs.Panel
              key={tab.value}
              value={tab.value}
              pt="xs"
              style={{ 
                display: activeTab === tab.value ? 'flex' : 'none',
                flexDirection: 'column',
                flex: 1, 
                // 詳細設定タブは自身でスクロール制御するため、親ではoverflow指定しない
                overflowY: tab.value === 'details' ? 'hidden' : 'auto', 
                overflowX: 'hidden' 
              }}
            >
              {tab.content}
            </Tabs.Panel>
          ))}
        </ScrollableTabs>

        {/* アクションボタン（ボタンがある場合のみ表示） */}
        {actionButtons.length > 0 && (
          <Group mt="md" justify="flex-end" gap="xs">
            {actionButtons}
          </Group>
        )}
      </form>

      {/* フローティングポップアップ */}
      {popups}

      {/* FAB */}
      {fabActions.length > 0 && (
        <SubMenuFAB
          items={fabActions}
        />
      )}
    </>
  )
}
