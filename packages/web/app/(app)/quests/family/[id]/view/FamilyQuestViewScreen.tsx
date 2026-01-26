"use client"

import { useState } from "react"
import { QuestViewLayout } from "../../../view/_components/QuestViewLayout"
import { ParentQuestViewFooter } from "./_components/ParentQuestViewFooter"
import { useFamilyQuest } from "./_hooks/useFamilyQuest"
import { useRouter } from "next/navigation"
import { useDisclosure } from "@mantine/hooks"
import { QuestEditModal } from "../../../_components/QuestEditModal"
import { FamilyQuestEdit } from "../FamilyQuestEdit"

/** 家族クエスト閲覧画面 */
export const FamilyQuestViewScreen = ({id}: {id: string}) => {
  const router = useRouter()
  
  /** 選択中のレベル */
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  /** 現在のクエスト状態 */
  const {familyQuest, isLoading} = useFamilyQuest({id})
  /** 編集モーダル制御状態 */
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false)

  /** 選択中のレベルの詳細を取得する */
  const selectedDetail = familyQuest?.details?.find(d => d.level === selectedLevel) || familyQuest?.details?.[0]

  /** 利用可能なレベル一覧を取得する */
  const availableLevels = familyQuest?.details?.map(d => d.level).filter((level): level is number => level !== null && level !== undefined) || []

  /** コメント数（TODO: 実装時にAPIから取得する） */
  const commentCount = 0

  return (
    <>
      <QuestViewLayout
        questName={familyQuest?.quest?.name || ""}
        backgroundColor={{ 
          light: "rgba(120, 53, 15, 0.2)", 
          dark: "rgba(255, 255, 255, 0.2)" 
        }}
        iconName={familyQuest?.icon?.name}
        iconSize={familyQuest?.icon?.size ?? 48}
        iconColor={familyQuest?.quest?.iconColor}
        isLoading={isLoading}
        level={selectedDetail?.level || 1}
        category={""}
        successCondition={selectedDetail?.successCondition || ""}
        reward={selectedDetail?.reward || 0}
        exp={selectedDetail?.childExp || 0}
        requiredCompletionCount={selectedDetail?.requiredCompletionCount || 0}
        client={familyQuest?.quest?.client || ""}
        requestDetail={familyQuest?.quest?.requestDetail || ""}
        tags={familyQuest?.tags?.map(tag => tag.name) || []}
        ageFrom={familyQuest?.quest?.ageFrom}
        ageTo={familyQuest?.quest?.ageTo}
        monthFrom={familyQuest?.quest?.monthFrom}
        monthTo={familyQuest?.quest?.monthTo}
        requiredClearCount={selectedDetail?.requiredClearCount || 0}
        commentCount={commentCount}
        footer={
          <ParentQuestViewFooter 
            availableLevels={availableLevels}
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
            onEdit={openEditModal}
            onBack={() => router.back()}
          />
        }
      />
      
      {/* 編集モーダル */}
      <QuestEditModal
        opened={editModalOpened}
        onClose={closeEditModal}
      >
        <FamilyQuestEdit id={id} />
      </QuestEditModal>
    </>
  )
}
