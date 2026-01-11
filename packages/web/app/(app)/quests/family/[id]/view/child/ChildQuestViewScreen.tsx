"use client"

import { Box, Paper, Tabs } from "@mantine/core"
import { useState } from "react"
import { QuestViewHeader } from "../../../../view/_components/QuestViewHeader"
import { QuestViewIcon } from "../../../../view/_components/QuestViewIcon"
import { QuestConditionTab } from "../../../../view/_components/QuestConditionTab"
import { QuestDetailTab } from "../../../../view/_components/QuestDetailTab"
import { QuestOtherTab } from "../../../../view/_components/QuestOtherTab"
import { ChildQuestViewFooter } from "./_components/ChildQuestViewFooter"
import { CompletionReportModal } from "./_components/CompletionReportModal"
import { useWindow } from "@/app/(core)/useConstants"
import { useChildQuest } from "./_hooks/useChildQuest"
import { useRouter } from "next/navigation"
import { useCompletionReport } from "./_hooks/useCompletionReport"

/** 子供クエスト閲覧画面 */
export const ChildQuestViewScreen = ({id}: {id: string}) => {
  const router = useRouter()
  const {isDark} = useWindow()

  /** ハンドル */
  const {handleCompleteReport, executeCompleteReport, closeModal, isModalOpen, isLoading} = useCompletionReport()
  
  /** アクティブタブ */
  const [activeTab, setActiveTab] = useState<string | null>("condition")

  /** 現在のクエスト状態 */
  const {childQuest} = useChildQuest({id})

  /** 選択中のレベルの詳細を取得する */
  const currentDetail = childQuest?.details?.find(d => d.level === childQuest.children[0].level) || childQuest?.details?.[0]

  return (
    <div className="flex flex-col p-4 h-full min-h-0" style={{ backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(120, 53, 15, 0.2)" }}>
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName={childQuest?.quest?.name || ""}
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
              level={currentDetail?.level || 1}
              category={""}
              successCondition={currentDetail?.successCondition || ""}
              reward={currentDetail?.reward || 0}
              exp={currentDetail?.childExp || 0}
              requiredCompletionCount={currentDetail?.requiredCompletionCount || 0}
            />
          </Tabs.Panel>

          {/* 依頼情報タブ */}
          <Tabs.Panel value="detail" pt="md">
            <QuestDetailTab 
              client={childQuest?.quest?.client || ""}
              requestDetail={childQuest?.quest?.requestDetail || ""}
            />
          </Tabs.Panel>

          {/* その他情報タブ */}
          <Tabs.Panel value="other" pt="md" className=" flex-1 overflow-y-auto">
            <QuestOtherTab
              tags={childQuest?.tags?.map(tag => tag.name) || []}
              ageFrom={childQuest?.quest?.ageFrom}
              ageTo={childQuest?.quest?.ageTo}
              monthFrom={childQuest?.quest?.monthFrom}
              monthTo={childQuest?.quest?.monthTo}
              requiredClearCount={currentDetail?.requiredClearCount || 0}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* 下部アクションエリア */}
      <ChildQuestViewFooter 
        onBack={() => router.back()}
        onCompletionReport={() => handleCompleteReport({
          familyQuestId: id,
          updatedAt: childQuest?.base.updatedAt,
        })}
        quest={childQuest}
        currentDetail={currentDetail}
      />

      {/* 完了報告モーダル */}
      <CompletionReportModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={executeCompleteReport}
        isLoading={isLoading}
      />
    </div>
  )
}
