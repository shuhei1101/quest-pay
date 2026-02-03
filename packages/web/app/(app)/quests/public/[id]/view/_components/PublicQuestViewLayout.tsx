"use client"

import { Box, Paper, Tabs, LoadingOverlay, Badge } from "@mantine/core"
import { useState, ReactNode } from "react"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { useWindow } from "@/app/(core)/useConstants"
import { QuestViewHeader } from "@/app/(app)/quests/view/_components/QuestViewHeader"
import { QuestConditionTab } from "@/app/(app)/quests/view/_components/QuestConditionTab"
import { QuestDetailTab } from "@/app/(app)/quests/view/_components/QuestDetailTab"
import { QuestOtherTab } from "@/app/(app)/quests/view/_components/QuestOtherTab"
import { QuestCommentTab } from "@/app/(app)/quests/view/_components/QuestCommentTab"

/** 公開クエスト閲覧レイアウトのプロパティ */
type PublicQuestViewLayoutProps = {
  /** クエスト名 */
  questName: string
  /** ヘッダーの色設定 */
  headerColor?: { light: string, dark: string }
  /** 背景色スタイル */
  backgroundColor: { light: string, dark: string }
  /** アイコン名 */
  iconName?: string
  /** アイコンサイズ */
  iconSize?: number
  /** アイコンカラー */
  iconColor?: string
  /** ローディング状態 */
  isLoading: boolean
  /** レベル */
  level: number
  /** カテゴリ */
  category: string
  /** 成功条件 */
  successCondition: string
  /** 報酬 */
  reward: number
  /** 経験値 */
  exp: number
  /** 必要達成回数 */
  requiredCompletionCount: number
  /** 依頼主 */
  client: string
  /** 依頼内容 */
  requestDetail: string
  /** タグ */
  tags: string[]
  /** 年齢From */
  ageFrom?: number | null
  /** 年齢To */
  ageTo?: number | null
  /** 月From */
  monthFrom?: number | null
  /** 月To */
  monthTo?: number | null
  /** 必要クリア回数 */
  requiredClearCount: number
  /** コメント数 */
  commentCount?: number
  /** 公開クエストID */
  publicQuestId: string
  /** フッター要素 */
  footer: ReactNode
}

/** 公開クエスト閲覧画面の共通レイアウト */
export const PublicQuestViewLayout = ({
  questName,
  headerColor,
  backgroundColor,
  iconName,
  iconSize,
  iconColor,
  isLoading,
  level,
  category,
  successCondition,
  reward,
  exp,
  requiredCompletionCount,
  client,
  requestDetail,
  tags,
  ageFrom,
  ageTo,
  monthFrom,
  monthTo,
  requiredClearCount,
  commentCount = 0,
  publicQuestId,
  footer,
}: PublicQuestViewLayoutProps) => {
  const {isDark} = useWindow()
  
  /** アクティブタブ */
  const [activeTab, setActiveTab] = useState<string | null>("condition")

  return (
    <Box pos="relative" className="flex flex-col p-4 h-full" style={{ backgroundColor: isDark ? backgroundColor.dark : backgroundColor.light }}>
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
      
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName={questName}
        headerColor={headerColor}
      />

      {/* クエスト内容カード */}
      <Paper
        className="flex-1 min-h-0"
        p="md" 
        radius="md" 
        style={{ 
          backgroundColor: isDark ? "#544c4c" : "#fffef5",
          boxShadow: "4px 4px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* タブ切り替え */}
        <ScrollableTabs
          value={activeTab}
          onChange={setActiveTab}
          items={[
            { value: "condition", label: "クエスト条件" },
            { value: "detail", label: "依頼情報" },
            { value: "other", label: "その他" },
            { 
              value: "comment", 
              label: "コメント",
              rightSection: commentCount > 0 ? (
                <Badge size="xs" color="red" circle>
                  {commentCount}
                </Badge>
              ) : undefined
            },
          ]}
        >
          {/* クエスト条件タブ */}
          <Tabs.Panel value="condition" pt="md">
            <QuestConditionTab
              level={level}
              category={category}
              successCondition={successCondition}
              reward={reward}
              exp={exp}
              requiredCompletionCount={requiredCompletionCount}
              iconName={iconName}
              iconSize={iconSize}
              iconColor={iconColor}
            />
          </Tabs.Panel>

          {/* 依頼情報タブ */}
          <Tabs.Panel value="detail" pt="md">
            <QuestDetailTab 
              client={client}
              requestDetail={requestDetail}
            />
          </Tabs.Panel>

          {/* その他情報タブ */}
          <Tabs.Panel value="other" pt="md">
            <QuestOtherTab
              tags={tags}
              ageFrom={ageFrom}
              ageTo={ageTo}
              monthFrom={monthFrom}
              monthTo={monthTo}
              requiredClearCount={requiredClearCount}
            />
          </Tabs.Panel>

          {/* コメントタブ */}
          <Tabs.Panel value="comment" pt="md">
            <QuestCommentTab id={publicQuestId} />
          </Tabs.Panel>
        </ScrollableTabs>
      </Paper>

      {/* 下部アクションエリア */}
      {footer}
    </Box>
  )
}
