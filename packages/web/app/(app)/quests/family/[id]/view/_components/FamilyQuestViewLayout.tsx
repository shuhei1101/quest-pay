"use client"

import { Box, Paper, Tabs, LoadingOverlay } from "@mantine/core"
import { useState } from "react"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { useWindow } from "@/app/(core)/useConstants"
import { QuestViewHeader } from "@/app/(app)/quests/view/_components/QuestViewHeader"
import { QuestConditionTab } from "@/app/(app)/quests/view/_components/QuestConditionTab"
import { QuestDetailTab } from "@/app/(app)/quests/view/_components/QuestDetailTab"
import { QuestOtherTab } from "@/app/(app)/quests/view/_components/QuestOtherTab"

/** 家族クエスト閲覧レイアウトのプロパティ */
type FamilyQuestViewLayoutProps = {
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
  requiredClearCount: number | null
  /** 利用可能なレベル一覧 */
  availableLevels?: number[]
  /** レベル変更時のコールバック */
  onLevelChange?: (level: number) => void
}

/** 家族クエスト閲覧画面の共通レイアウト */
export const FamilyQuestViewLayout = ({
  questName,
  headerColor,
  backgroundColor: _backgroundColor,
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
  availableLevels,
  onLevelChange,
}: FamilyQuestViewLayoutProps) => {
  const {isDark} = useWindow()
  void _backgroundColor
  
  /** アクティブタブ */
  const [activeTab, setActiveTab] = useState<string | null>("condition")

  return (
    <Box
      pos="relative"
      className="flex flex-col h-full overflow-x-hidden"
    >
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
      
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName={questName}
        headerColor={headerColor}
        iconName={iconName}
        iconColor={iconColor}
        category={category}
        level={level}
        reward={reward}
        exp={exp}
        availableLevels={availableLevels}
        onLevelChange={onLevelChange}
      />

      {/* クエスト内容カード */}
      <Paper
        className="flex-1 min-h-[800px] overflow-x-hidden overflow-y-auto"
        p="md"
        radius="xl"
        style={{
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          border: isDark ? "1px solid rgba(148, 163, 184, 0.18)" : "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        {/* タブ切り替え */}
        <ScrollableTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="editorial"
          tabs={[
            { value: "condition", label: "条件" },
            { value: "detail", label: "依頼情報" },
            { value: "other", label: "その他" },
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
              availableLevels={availableLevels}
              onLevelChange={onLevelChange}
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
        </ScrollableTabs>
      </Paper>
    </Box>
  )
}
