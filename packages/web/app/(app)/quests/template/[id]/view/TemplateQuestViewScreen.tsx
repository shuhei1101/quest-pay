"use client"

import { Box, Paper, Tabs } from "@mantine/core"
import { useState } from "react"
import { QuestViewHeader } from "../../../view/_components/QuestViewHeader"
import { QuestViewIcon } from "../../../view/_components/QuestViewIcon"
import { QuestConditionTab } from "../../../view/_components/QuestConditionTab"
import { QuestDetailTab } from "../../../view/_components/QuestDetailTab"
import { QuestOtherTab } from "../../../view/_components/QuestOtherTab"
import { useWindow } from "@/app/(core)/useConstants"
import { useTemplateQuest } from "./_hooks/useTemplateQuest"
import { useRouter } from "next/navigation"
import { TemplateQuestViewFooter } from "./_components/TemplateQuestViewFooter"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { FAMILY_QUEST_NEW_URL, PUBLIC_QUEST_VIEW_URL } from "@/app/(core)/endpoints"
import toast from "react-hot-toast"

/** テンプレートクエスト閲覧画面 */
export const TemplateQuestViewScreen = ({id}: {id: string}) => {
  const router = useRouter()
  const {isDark} = useWindow()
  
  /** アクティブタブ */
  const [activeTab, setActiveTab] = useState<string | null>("condition")
  /** 選択中のレベル */
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  /** 現在のクエスト状態 */
  const {templateQuest} = useTemplateQuest({id})

  /** 選択中のレベルの詳細を取得する */
  const selectedDetail = templateQuest?.details?.find(d => d.level === selectedLevel) || templateQuest?.details?.[0]

  /** 利用可能なレベル一覧を取得する */
  const availableLevels = templateQuest?.details?.map(d => d.level).filter((level): level is number => level !== null && level !== undefined) || []

  /** クエスト削除ハンドル */
  const onDelete = () => {

  }

  /** テンプレートから作成ハンドル */
  const onCreateFromTemplate = () => {
    appStorage.familyQuestForm.set({
      name: templateQuest?.quest?.name || "",
      iconId: templateQuest?.quest?.iconId || 0,
      iconColor: templateQuest?.quest?.iconColor || "blue",
      tags: templateQuest?.tags?.map(tag => tag.name) || [],
      categoryId: templateQuest?.quest?.categoryId || 0,
      ageFrom: templateQuest?.quest?.ageFrom || null,
      ageTo: templateQuest?.quest?.ageTo || null,
      monthFrom: templateQuest?.quest?.monthFrom || null,
      monthTo: templateQuest?.quest?.monthTo || null,
      client: templateQuest?.quest?.client || "",
      requestDetail: templateQuest?.quest?.requestDetail || "",
      details: templateQuest?.details.map(detail => ({
        level: detail.level,
        successCondition: detail.successCondition,
        requiredCompletionCount: detail.requiredCompletionCount,
        childExp: detail.childExp,
        reward: detail.reward,
        requiredClearCount: detail.requiredClearCount,
      })) || [],
      childIds: []
    })

    // 家族クエスト作成画面へ遷移する
    router.push(FAMILY_QUEST_NEW_URL)
  }

  /** 元のクエストを確認するハンドル */
  const onCheckSource = () => {
    if (templateQuest?.publicQuest) {
      router.push(PUBLIC_QUEST_VIEW_URL(templateQuest.publicQuest.id))
    } else {
      toast.error("元のクエスト情報が見つかりません。")
    }
  }

  return (
    <div className="flex flex-col p-4 h-full min-h-0" style={{ backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(120, 53, 15, 0.2)" }}>
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName={templateQuest?.quest?.name || ""}
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
              client={templateQuest?.quest?.client || ""}
              requestDetail={templateQuest?.quest?.requestDetail || ""}
            />
          </Tabs.Panel>

          {/* その他情報タブ */}
          <Tabs.Panel value="other" pt="md" className=" flex-1 overflow-y-auto">
            <QuestOtherTab
              tags={templateQuest?.tags?.map(tag => tag.name) || []}
              ageFrom={templateQuest?.quest?.ageFrom}
              ageTo={templateQuest?.quest?.ageTo}
              monthFrom={templateQuest?.quest?.monthFrom}
              monthTo={templateQuest?.quest?.monthTo}
              requiredClearCount={selectedDetail?.requiredClearCount || 0}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* 下部アクションエリア */}
      <TemplateQuestViewFooter 
        availableLevels={ availableLevels }
        selectedLevel={ selectedLevel }
        onLevelChange={ setSelectedLevel }
        onBack={ () => router.back() } 
        familyIcon={ templateQuest?.familyIcon?.name }
        onDelete={ onDelete }
        onCreateFromTemplate={ onCreateFromTemplate }
        onCheckSource={ onCheckSource }
        hasSourceQuest={ !!templateQuest?.base.publicQuestId }
      />
    </div>
  )
}
