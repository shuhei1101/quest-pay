"use client"

import { Box, Paper, Tabs, LoadingOverlay } from "@mantine/core"
import { useState } from "react"
import { QuestViewHeader } from "../../../../../view/_components/QuestViewHeader"
import { QuestViewIcon } from "../../../../../view/_components/QuestViewIcon"
import { QuestConditionTab } from "../../../../../view/_components/QuestConditionTab"
import { QuestDetailTab } from "../../../../../view/_components/QuestDetailTab"
import { QuestOtherTab } from "../../../../../view/_components/QuestOtherTab"
import { ChildQuestViewFooter } from "./_components/ChildQuestViewFooter"
import { ParentChildQuestViewFooter } from "./_components/ParentChildQuestViewFooter"
import { ReviewRequestModal } from "./_components/ReviewRequestModal"
import { CancelReviewModal } from "./_components/CancelReviewModal"
import { ReportReviewModal } from "./_components/ReportReviewModal"
import { useWindow } from "@/app/(core)/useConstants"
import { useChildQuest } from "./_hooks/useChildQuest"
import { useRouter } from "next/navigation"
import { useReviewRequest } from "./_hooks/useReviewRequest"
import { useCancelReview } from "./_hooks/useCancelReview"
import { useRejectReport } from "./_hooks/useRejectReport"
import { useApproveReport } from "./_hooks/useApproveReport"
import { useDeleteChildQuest } from "./_hooks/useDeleteChildQuest"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { FAMILY_QUEST_EDIT_URL } from "@/app/(core)/endpoints"

/** 子供クエスト閲覧画面 */
export const ChildQuestViewScreen = ({id, childId}: {id: string, childId: string}) => {
  const router = useRouter()
  const {isDark} = useWindow()
  const {isParent, isChild} = useLoginUserInfo()

  /** ハンドル（子供用） */
  const {handleReviewRequest, executeReviewRequest, closeModal, isModalOpen, isLoading} = useReviewRequest()
  const {handleCancelReview, executeCancelReview, closeModal: closeCancelModal, isModalOpen: isCancelModalOpen, isLoading: isCancelLoading} = useCancelReview()
  
  /** ハンドル（親用） */
  const {handleRejectReport, executeRejectReport, closeModal: closeRejectModal, isModalOpen: isRejectModalOpen, isLoading: isRejectLoading} = useRejectReport()
  const {handleApproveReport, executeApproveReport, closeModal: closeApproveModal, isModalOpen: isApproveModalOpen, isLoading: isApproveLoading} = useApproveReport()
  const {handleDelete, isLoading: isDeleteLoading} = useDeleteChildQuest()
  
  /** アクティブタブ */
  const [activeTab, setActiveTab] = useState<string | null>("condition")

  /** 現在のクエスト状態 */
  const {childQuest, isLoading: questLoading} = useChildQuest({id, childId})

  /** 選択中のレベルの詳細を取得する */
  const currentDetail = childQuest?.details?.find(d => d.level === childQuest.children[0].level) || childQuest?.details?.[0]

  return (
    <Box pos="relative" className="flex flex-col p-4 h-full min-h-0" style={{ backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(120, 53, 15, 0.2)" }}>
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={questLoading || isDeleteLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
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
              currentCompletionCount={childQuest?.children[0].currentCompletionCount}
              type="child"
              currentClearCount={childQuest?.children[0].currentClearCount}
              requiredClearCount={currentDetail?.requiredClearCount}
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
      {isParent && (
        /* 親ユーザの場合 */
        <ParentChildQuestViewFooter
          isPendingReview={childQuest?.children[0].status === "pending_review"}
          onReviewReport={() => handleApproveReport({
            familyQuestId: id,
            childId,
            updatedAt: childQuest?.base.updatedAt || '',
          })}
          onEdit={() => router.push(FAMILY_QUEST_EDIT_URL(id))}
          onReset={() => handleDelete({familyQuestId: id, childId})}
        />
      )} 
      
      {isChild && (
        /* 子供ユーザの場合 */
        <ChildQuestViewFooter 
          onBack={() => router.back()}
          onReviewRequest={() => handleReviewRequest({
            familyQuestId: id,
            updatedAt: childQuest?.base.updatedAt,
          })}
          onCancelReview={() => handleCancelReview({
            familyQuestId: id,
            updatedAt: childQuest?.base.updatedAt,
          })}
          quest={childQuest}
          currentDetail={currentDetail}
        />
      )}

      {/* 完了報告モーダル（子供用） */}
      <ReviewRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={executeReviewRequest}
        isLoading={isLoading}
      />

      {/* キャンセルモーダル（子供用） */}
      <CancelReviewModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onSubmit={executeCancelReview}
        isLoading={isCancelLoading}
      />

      {/* 報告内容確認モーダル（親用） */}
      <ReportReviewModal
        isOpen={isApproveModalOpen}
        onClose={closeApproveModal}
        onReject={executeRejectReport}
        onApprove={executeApproveReport}
        isLoading={isApproveLoading || isRejectLoading}
        requestMessage={childQuest?.children[0].requestMessage || undefined}
      />
    </Box>
  )
}
