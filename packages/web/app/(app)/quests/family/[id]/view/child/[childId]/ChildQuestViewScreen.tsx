"use client"

import { ChildQuestViewLayout } from "./_components/ChildQuestViewLayout"
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
import { FAMILY_QUEST_VIEW_URL } from "@/app/(core)/endpoints"
import { Fragment } from "react"
import { SubMenuFAB } from "@/app/(core)/_components/SubMenuFAB"
import { IconEdit, IconRefresh, IconCheck, IconX, IconEye } from "@tabler/icons-react"
import { useWindow } from "@/app/(core)/useConstants"

/** 子供クエスト閲覧画面 */
export const ChildQuestViewScreen = ({id, childId}: {id: string, childId: string}) => {
  const router = useRouter()
  const {isParent, isChild} = useLoginUserInfo()
  const { isMobile } = useWindow()

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

  /** 親用のFABアイテム */
  const parentFabItems = [
    ...(childQuest?.children[0].status === "pending_review" ? [{
      icon: <IconEye size={20} />,
      label: "報告確認",
      onClick: () => handleApproveReport({
        familyQuestId: id,
        childId,
        updatedAt: childQuest?.base.updatedAt || '',
      }),
      color: "blue" as const,
    }] : []),
    {
      icon: <IconEdit size={20} />,
      label: "編集",
      onClick: () => router.push(FAMILY_QUEST_VIEW_URL(id)),
      color: "gray" as const,
    },
    {
      icon: <IconRefresh size={20} />,
      label: "リセット",
      onClick: () => handleDelete({familyQuestId: id, childId}),
      color: "red" as const,
    },
  ]

  /** 子供用のFABアイテム */
  const childFabItems = [
    ...(childQuest?.children[0].status === "pending_review" ? [{
      icon: <IconX size={20} />,
      label: "取消",
      onClick: () => handleCancelReview({
        familyQuestId: id,
        updatedAt: childQuest?.base.updatedAt,
      }),
      color: "red" as const,
    }] : []),
    {
      icon: <IconCheck size={20} />,
      label: "報告",
      onClick: () => handleReviewRequest({
        familyQuestId: id,
        updatedAt: childQuest?.base.updatedAt,
      }),
      color: "blue" as const,
    },
  ]

  return (
    <Fragment>
      {/* クエスト閲覧レイアウト */}
      <ChildQuestViewLayout
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
        requiredClearCount={currentDetail?.requiredClearCount ?? null}
        footer={<></>}
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

      {/* FAB */}
      {isParent && (
        <SubMenuFAB
          items={parentFabItems}
          pattern={isMobile ? "radial-up" : "radial-left"}
        />
      )}
      {isChild && (
        <SubMenuFAB
          items={childFabItems}
          pattern={isMobile ? "radial-up" : "radial-left"}
        />
      )}
    </Fragment>
  )
}
