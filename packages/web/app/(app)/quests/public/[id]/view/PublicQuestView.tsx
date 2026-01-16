"use client"

import { Box, Paper, Tabs, LoadingOverlay } from "@mantine/core"
import { useState } from "react"
import { QuestViewHeader } from "../../../view/_components/QuestViewHeader"
import { QuestViewIcon } from "../../../view/_components/QuestViewIcon"
import { QuestConditionTab } from "../../../view/_components/QuestConditionTab"
import { QuestDetailTab } from "../../../view/_components/QuestDetailTab"
import { QuestOtherTab } from "../../../view/_components/QuestOtherTab"
import { ParentQuestViewFooter } from "../../../family/[id]/view/_components/ParentQuestViewFooter"
import { useWindow } from "@/app/(core)/useConstants"
import { usePublicQuest } from "./_hooks/usePublicQuest"
import { useRouter } from "next/navigation"
import { PublicQuestViewFooter } from "./_components/PublicQuestViewFooter"
import { useLikeQuest } from "./_hooks/useLikeQuest"
import { useLikeCount } from "./_hooks/useLikeCount"
import { useIsLike } from "./_hooks/useIsLike"
import { useCancelQuestLike } from "./_hooks/useCancelQuestLike"

/** 公開クエスト閲覧画面 */
export const PublicQuestView = ({id}: {id: string}) => {
  const router = useRouter()
  const {isDark} = useWindow()
  
  /** アクティブタブ */
  const [activeTab, setActiveTab] = useState<string | null>("condition")
  /** 選択中のレベル */
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  /** 現在のクエスト状態 */
  const {publicQuest, isLoading} = usePublicQuest({id})

  /** 選択中のレベルの詳細を取得する */
  const selectedDetail = publicQuest?.details?.find(d => d.level === selectedLevel) || publicQuest?.details?.[0]

  /** 利用可能なレベル一覧を取得する */
  const availableLevels = publicQuest?.details?.map(d => d.level).filter((level): level is number => level !== null && level !== undefined) || []

  /** いいね数 */
  const { likeCount } = useLikeCount({ id })

  /** いいねされているかどうか */
  const { isLike } = useIsLike({ id })

  /** いいねハンドル */
  const { handleLike, isLoading: isLikeLoading } = useLikeQuest()
  /** いいね解除ハンドル */
  const { handleCancelLike, isLoading: isCancelLikeLoading } = useCancelQuestLike()

  /** いいね押下時のハンドル */
  const likeToggleHandle = () => {
    if (isLike) {
      // いいねされている場合、いいねを取り消す
      handleCancelLike({publicQuestId: id})
    } else {
      // いいねされていない場合、いいねする
      handleLike({publicQuestId: id})
    }
  }

  return (
    <Box pos="relative" className="flex flex-col p-4 h-full min-h-0" style={{ backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(120, 53, 15, 0.2)" }}>
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName={publicQuest?.quest?.name || ""}
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
              client={publicQuest?.quest?.client || ""}
              requestDetail={publicQuest?.quest?.requestDetail || ""}
            />
          </Tabs.Panel>

          {/* その他情報タブ */}
          <Tabs.Panel value="other" pt="md" className=" flex-1 overflow-y-auto">
            <QuestOtherTab
              tags={publicQuest?.tags?.map(tag => tag.name) || []}
              ageFrom={publicQuest?.quest?.ageFrom}
              ageTo={publicQuest?.quest?.ageTo}
              monthFrom={publicQuest?.quest?.monthFrom}
              monthTo={publicQuest?.quest?.monthTo}
              requiredClearCount={selectedDetail?.requiredClearCount || 0}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* 下部アクションエリア */}
      <PublicQuestViewFooter 
        availableLevels={ availableLevels }
        selectedLevel={ selectedLevel }
        onLevelChange={ setSelectedLevel }
        onBack={ () => router.back() } 
        familyIcon={ publicQuest?.familyIcon?.name }
        likeCount={ likeCount || 0 } 
        commentCount={ 0 } 
        isLiked={ isLike }
        onLikeToggle={ likeToggleHandle }
        isLikeLoading={ isLikeLoading || isCancelLikeLoading }
      />
    </Box>
  )
}
