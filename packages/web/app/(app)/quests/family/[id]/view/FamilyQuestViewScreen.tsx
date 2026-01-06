"use client"

import { Box, Paper, Tabs } from "@mantine/core"
import { useState } from "react"
import { QuestViewHeader } from "../../../view/_components/QuestViewHeader"
import { QuestViewIcon } from "../../../view/_components/QuestViewIcon"
import { QuestConditionTab } from "../../../view/_components/QuestConditionTab"
import { QuestDetailTab } from "../../../view/_components/QuestDetailTab"
import { QuestOtherTab } from "../../../view/_components/QuestOtherTab"
import { ParentQuestViewFooter } from "./_components/ParentQuestViewFooter"
import { useWindow } from "@/app/(core)/useConstants"
import { useFamilyQuest } from "./_hooks/useFamilyQuest"
import { useRouter } from "next/navigation"

/** 家族クエスト閲覧画面 */
export const FamilyQuestViewScreen = ({id}: {id: string}) => {
  const router = useRouter()
  const {isDark} = useWindow()
  
  /** アクティブタブ */
  const [activeTab, setActiveTab] = useState<string | null>("condition")
  /** 選択中のレベル */
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  /** 現在のクエスト状態 */
  const {familyQuest} = useFamilyQuest({id})

  /** 選択中のレベルの詳細を取得する */
  const selectedDetail = familyQuest?.details?.find(d => d.level === selectedLevel) || familyQuest?.details?.[0]

  /** 利用可能なレベル一覧を取得する */
  const availableLevels = familyQuest?.details?.map(d => d.level).filter((level): level is number => level !== null && level !== undefined) || []

  return (
    <div className="flex flex-col p-4 h-full min-h-0" style={{ backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(120, 53, 15, 0.2)" }}>
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName={familyQuest?.quest?.name || ""}
      />

      {/* クエストアイコン */}
      <QuestViewIcon />

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
        <Tabs 
          value={activeTab} 
          onChange={setActiveTab} 
          className="flex-1 min-h-0"
          styles={{
            root: { display: "flex", flexDirection: "column", height: "100%" },
            panel: { flex: 1, minHeight: 0, overflow: "auto", paddingRight: 16},
          }}
        >
          <Tabs.List grow>
              <Tabs.Tab value="condition">クエスト条件</Tabs.Tab>
              <Tabs.Tab value="detail">依頼情報</Tabs.Tab>
              <Tabs.Tab value="other">その他</Tabs.Tab>
          </Tabs.List>

          {/* クエスト条件タブ */}
          <Tabs.Panel value="condition" pt="md">
            <QuestConditionTab
              level={selectedDetail?.level || 1}
              category={""}
              successCondition={selectedDetail?.successCondition || ""}
              reward={selectedDetail?.reward || 0}
              exp={selectedDetail?.childExp || 0}
              requiredCompletionCount={selectedDetail?.requiredCompletionCount || 0}
            />
          </Tabs.Panel>

          {/* 依頼情報タブ */}
          <Tabs.Panel value="detail" pt="md">
            <QuestDetailTab 
              client={familyQuest?.quest?.client || ""}
              requestDetail={familyQuest?.quest?.requestDetail || ""}
            />
          </Tabs.Panel>

          {/* その他情報タブ */}
          <Tabs.Panel value="other" pt="md" className=" flex-1 overflow-y-auto">
            <QuestOtherTab
              tags={familyQuest?.tags?.map(tag => tag.name) || []}
              ageFrom={familyQuest?.quest?.ageFrom}
              ageTo={familyQuest?.quest?.ageTo}
              monthFrom={familyQuest?.quest?.monthFrom}
              monthTo={familyQuest?.quest?.monthTo}
              requiredClearCount={selectedDetail?.requiredClearCount || 0}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* 下部アクションエリア */}
      <ParentQuestViewFooter 
        availableLevels={availableLevels}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
        onBack={() => router.back()}
      />
    </div>
  )
}
