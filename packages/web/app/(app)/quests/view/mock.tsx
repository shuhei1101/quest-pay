"use client"

import { Box, Paper, Tabs } from "@mantine/core"
import { useState } from "react"
import { QuestViewHeader } from "./_component/QuestViewHeader"
import { QuestViewIcon } from "./_component/QuestViewIcon"
import { QuestConditionTab } from "./_component/QuestConditionTab"
import { QuestDetailTab } from "./_component/QuestDetailTab"
import { OnlineQuestViewFooter } from "./_component/OnlineQuestViewFooter"
import { ChildQuestViewFooter } from "./_component/ChildQuestViewFooter"
import { QuestOtherTab } from "./_component/QuestOtherTab"

/** クエスト閲覧画面モック（子供向け） */
export const MockQuestViewA = () => {
  const [activeTab, setActiveTab] = useState<string | null>("condition")
  const [isLiked, setIsLiked] = useState(false)

  /** 表示モード: "child"（子供向け）または "online"（オンライン閲覧向け） */
  const viewMode: "child" | "online" = "child"

  /** いいね数 */
  const likeCount = 24
  /** コメント数 */
  const commentCount = 5

  return (
    <Box className="min-h-screen bg-amber-900/20 p-4">
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName="洗濯物を干そう！"
      />

      {/* クエストアイコン */}
      <QuestViewIcon />

      {/* クエスト内容カード（チラシ風） */}
      <Paper 
        p="md" 
        radius="md" 
        withBorder 
        style={{ 
          backgroundColor: "#fffef5",
          boxShadow: "4px 4px 8px rgba(0,0,0,0.15)",
          transform: "rotate(-0.5deg)",
          position: "relative"
        }}
      >
        {/* タブ切り替え */}
        <Tabs value={activeTab} onChange={setActiveTab} mb="md">
          <Tabs.List grow>
            <Tabs.Tab value="condition">クエスト条件</Tabs.Tab>
            <Tabs.Tab value="detail">依頼情報</Tabs.Tab>
            <Tabs.Tab value="other">その他</Tabs.Tab>
          </Tabs.List>

          {/* クエスト条件タブ */}
          <Tabs.Panel value="condition" pt="md">
            <QuestConditionTab 
              level={ 4 }
              category="社会活動"
              successCondition="週末に溜まっている洗濯ものを洗濯して、取り込む"
              reward={ 100 }
              exp={ 50 } 
              requiredCompletionCount={ 0 }
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
          <Tabs.Panel value="other" pt="md">
            <QuestOtherTab 
              ageFrom={5}
              ageTo={12}
              monthFrom={4}
              monthTo={10}
              requiredClearCount={10}
              tags={["家事", "洗濯", "週末"]}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* 下部アクションエリア */}
      {viewMode === "child" ? (
        <ChildQuestViewFooter status={ "not_accepted" } />
      ) : (
        <OnlineQuestViewFooter 
          familyName="山田家"
          familyInitial="山"
          likeCount={likeCount}
          commentCount={commentCount}
          isLiked={isLiked}
          onLikeToggle={() => setIsLiked(!isLiked)}
        />
      )}
    </Box>
  )
}

/** クエスト閲覧画面モック（オンライン向け） */
export const MockQuestViewB = () => {
  const [activeTab, setActiveTab] = useState<string | null>("condition")
  const [isLiked, setIsLiked] = useState(false)

  /** 表示モード */
  const viewMode: "child" | "online" = "online"

  /** いいね数 */
  const likeCount = 24
  /** コメント数 */
  const commentCount = 5

  return (
    <Box className="min-h-screen bg-amber-900/20 p-4">
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName="洗濯物を干そう！"
      />

      {/* クエストアイコン */}
      <QuestViewIcon />

      {/* クエスト内容カード（チラシ風） */}
      <Paper 
        p="md" 
        radius="md" 
        withBorder 
        style={{ 
          backgroundColor: "#fffef5",
          boxShadow: "4px 4px 8px rgba(0,0,0,0.15)",
          transform: "rotate(-0.5deg)",
          position: "relative"
        }}
      >
        {/* タブ切り替え */}
        <Tabs value={activeTab} onChange={setActiveTab} mb="md">
          <Tabs.List grow>
            <Tabs.Tab value="condition">クエスト条件</Tabs.Tab>
            <Tabs.Tab value="detail">依頼情報</Tabs.Tab>
            <Tabs.Tab value="other">その他</Tabs.Tab>
          </Tabs.List>

          {/* クエスト条件タブ */}
          <Tabs.Panel value="condition" pt="md">
            <QuestConditionTab 
              level={ 4 }
              category="社会活動"
              successCondition="週末に溜まっている洗濯ものを洗濯して、取り込む"
              reward={ 100 }
              exp={ 50 } requiredCompletionCount={ 0 }            />
          </Tabs.Panel>

          {/* 依頼情報タブ */}
          <Tabs.Panel value="detail" pt="md">
            <QuestDetailTab 
              client="母親"
              requestDetail="最近洗濯ものが溜まっていて大変なんだよね。だれか干してくれないかな。"
            />
          </Tabs.Panel>

          {/* その他情報タブ */}
          <Tabs.Panel value="other" pt="md">
            <QuestOtherTab 
              ageFrom={5}
              ageTo={12}
              monthFrom={4}
              monthTo={10}
              requiredClearCount={10}
              tags={["家事", "洗濯", "週末"]}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* 下部アクションエリア（オンライン向け） */}
      <OnlineQuestViewFooter 
        familyName="山田家"
        familyInitial="山"
        likeCount={likeCount}
        commentCount={commentCount}
        isLiked={isLiked}
        onLikeToggle={() => setIsLiked(!isLiked)}
      />
    </Box>
  )
}
