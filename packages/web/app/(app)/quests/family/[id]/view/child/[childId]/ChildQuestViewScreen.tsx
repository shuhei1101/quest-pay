"use client"

import { QuestViewLayout } from "../../../../../view/_components/QuestViewLayout"
import { ChildQuestViewFooter } from "./_components/ChildQuestViewFooter"
import { ParentChildQuestViewFooter } from "./_components/ParentChildQuestViewFooter"
import { ReviewRequestModal } from "./_components/ReviewRequestModal"
import { CancelReviewModal } from "./_components/CancelReviewModal"
import { ReportReviewModal } from "./_components/ReportReviewModal"
import { useChildQuest } from "./_hooks/useChildQuest"
import { useRouter } from "next/navigation"
import { useReviewRequest } from "./_hooks/useReviewRequest"
import { useCancelReview } from "./_hooks/useCancelReview"
import { useRejectReport } from "./_hooks/useRejectReport"
import { useApproveReport } from "./_hooks/useApproveReport"
import { useDeleteChildQuest } from "./_hooks/useDeleteChildQuest"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { FAMILY_QUEST_EDIT_URL } from "@/app/(core)/endpoints"
import { Fragment } from "react"

/** 子供クエスト閲覧画面 */
export const ChildQuestViewScreen = ({id, childId}: {id: string, childId: string}) => {
  const router = useRouter()
  const {isParent, isChild} = useLoginUserInfo()

  /** ハンドル（子供用） */
  const {handleReviewRequest, executeReviewRequest, closeModal, isModalOpen, isLoading} = useReviewRequest()
  const {handleCancelReview, executeCancelReview, closeModal: closeCancelModal, isModalOpen: isCancelModalOpen, isLoading: isCancelLoading} = useCancelReview()
  
  /** ハンドル（親用） */
  const {handleRejectReport, executeRejectReport, closeModal: closeRejectModal, isModalOpen: isRejectModalOpen, isLoading: isRejectLoading} = useRejectReport()
  const {handleApproveReport, executeApproveReport, closeModal: closeApproveModal, isModalOpen: isApproveModalOpen, isLoading: isApproveLoading} = useApproveReport()
  const {handleDelete, isLoading: isDeleteLoading} = useDeleteChildQuest()

  /** 現在のクエスト状態 */
  const {childQuest, isLoading: questLoading} = useChildQuest({id, childId})

  /** 選択中のレベルの詳細を取得する */
  const currentDetail = childQuest?.details?.find(d => d.level === childQuest.children[0].level) || childQuest?.details?.[0]

  return (
    <Fragment>
      {/* クエスト閲覧レイアウト */}
      <QuestViewLayout
        questName={childQuest?.quest?.name || ""}
        backgroundColor={{ light: "rgba(120, 53, 15, 0.2)", dark: "rgba(255, 255, 255, 0.2)" }}
        isLoading={questLoading || isDeleteLoading}
        level={currentDetail?.level || 1}
        category={childQuest?.category?.name || ""}
        successCondition={currentDetail?.successCondition || ""}
        reward={currentDetail?.reward || 0}
        exp={currentDetail?.childExp || 0}
        requiredCompletionCount={currentDetail?.requiredCompletionCount || 0}
        client={childQuest?.quest?.client || ""}
        requestDetail={childQuest?.quest?.requestDetail || ""}
        tags={childQuest?.tags?.map(tag => tag.name) || []}
        ageFrom={childQuest?.quest?.ageFrom}
        ageTo={childQuest?.quest?.ageTo}
        monthFrom={childQuest?.quest?.monthFrom}
        monthTo={childQuest?.quest?.monthTo}
        requiredClearCount={currentDetail?.requiredClearCount || 0}
        commentCount={0}
        footer={
          isParent ? (
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
          ) : isChild ? (
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
          ) : null
        }
      />

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
    </Fragment>
  )
}
