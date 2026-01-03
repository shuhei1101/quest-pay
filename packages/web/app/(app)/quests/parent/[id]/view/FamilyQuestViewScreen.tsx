"use client"

import { Box, Paper, Tabs } from "@mantine/core"
import { useState } from "react"
import { QuestViewHeader } from "../../../view/_component/QuestViewHeader"
import { QuestViewIcon } from "../../../view/_component/QuestViewIcon"
import { QuestConditionTab } from "../../../view/_component/QuestConditionTab"
import { QuestDetailTab } from "../../../view/_component/QuestDetailTab"
import { QuestOtherTab } from "../../../view/_component/QuestOtherTab"
import { ParentQuestViewFooter } from "../../../view/_component/ParentQuestViewFooter"
import { useWindow } from "@/app/(core)/useConstants"

/** 家族クエスト閲覧画面 */
export const FamilyQuestViewScreen = ({id}: {id: string}) => {
  const [activeTab, setActiveTab] = useState<string | null>("condition")
  const [isLiked, setIsLiked] = useState(false)
  const {isDark} = useWindow()

  return (
    <div className="flex flex-col p-4 h-full min-h-0" style={{ backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(120, 53, 15, 0.2)" }}>
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName="洗濯物を干そう！"
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
              level={4}
              category="社会活動"
              successCondition={`①週末に溜まっている洗濯ものを洗濯して、取り込む
                ②洗濯物を所定の場所にしまう
                ②洗濯物を所定の場所にしまう
                ②洗濯物を所定の場所にしまう
                ②洗濯物を所定の場所にしまう
                ③洗濯機の使い方を守る`}
              reward={100}
              exp={50}
            />
          </Tabs.Panel>

          {/* 依頼情報タブ */}
          <Tabs.Panel value="detail" pt="md">
            <QuestDetailTab 
              client="母親"
              requestDetail="最近洗濯ものが溜まっていて大変なんだよね。だれか干してくれないかな。"
            />
          </Tabs.Panel>

          {/* その他情報タブ */}
          <Tabs.Panel value="other" pt="md" className=" flex-1 overflow-y-auto">
            <QuestOtherTab
              tags={["家事", "洗濯", "週末"]}
              ageFrom={5}
              ageTo={12}
              monthFrom={4}
              monthTo={10}
              requiredCompletionCount={5}
              requiredClearCount={10}
              currentClearCount={3}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* 下部アクションエリア */}
      <ParentQuestViewFooter />
    </div>
  )
}
