"use client"

import { useState } from "react"
import { QuestViewLayout } from "../../../view/_components/QuestViewLayout"
import { useWindow } from "@/app/(core)/useConstants"
import { usePublicQuest } from "./_hooks/usePublicQuest"
import { useRouter } from "next/navigation"
import { PublicQuestViewFooter } from "./_components/PublicQuestViewFooter"
import { useLikeQuest } from "./_hooks/useLikeQuest"
import { useLikeCount } from "./_hooks/useLikeCount"
import { useIsLike } from "./_hooks/useIsLike"
import { useCancelQuestLike } from "./_hooks/useCancelQuestLike"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { useDisclosure } from "@mantine/hooks"
import { QuestEditModal } from "../../../_components/QuestEditModal"
import { PublicQuestEdit } from "../PublicQuestEdit"
import { Button, Group } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"

/** 公開クエスト閲覧画面 */
export const PublicQuestView = ({id}: {id: string}) => {
  const router = useRouter()
  
  /** 選択中のレベル */
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  /** 現在のクエスト状態 */
  const {publicQuest, isLoading} = usePublicQuest({id})
  
  /** ログインユーザ情報 */
  const { userInfo } = useLoginUserInfo()
  
  /** 編集権限があるかどうか */
  const hasEditPermission = publicQuest?.base.familyId === userInfo?.profiles?.familyId
  
  /** 編集モーダル制御状態 */
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false)

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

  /** コメント数（TODO: 実装時にAPIから取得する） */
  const commentCount = 0

  return (
    <>
      <QuestViewLayout
        questName={publicQuest?.quest?.name || ""}
        headerColor={{ light: "blue.3", dark: "blue.5" }}
        backgroundColor={{ 
          light: "rgba(191, 219, 254, 0.5)", 
          dark: "rgba(59, 130, 246, 0.2)" 
        }}
        iconColor={publicQuest?.quest?.iconColor}
        iconName={publicQuest?.icon?.name}
        iconSize={publicQuest?.icon?.size ?? 48}
        isLoading={isLoading}
        level={selectedDetail?.level || 1}
        category={""}
        successCondition={selectedDetail?.successCondition || ""}
        reward={selectedDetail?.reward || 0}
        exp={selectedDetail?.childExp || 0}
        requiredCompletionCount={selectedDetail?.requiredCompletionCount || 0}
        client={publicQuest?.quest?.client || ""}
        requestDetail={publicQuest?.quest?.requestDetail || ""}
        tags={publicQuest?.tags?.map(tag => tag.name) || []}
        ageFrom={publicQuest?.quest?.ageFrom}
        ageTo={publicQuest?.quest?.ageTo}
        monthFrom={publicQuest?.quest?.monthFrom}
        monthTo={publicQuest?.quest?.monthTo}
        requiredClearCount={selectedDetail?.requiredClearCount || 0}
        commentCount={commentCount}
        footer={
          <Group justify="center" mt="xl" gap="md">
            <PublicQuestViewFooter 
              availableLevels={ availableLevels }
              selectedLevel={ selectedLevel }
              onLevelChange={ setSelectedLevel }
              onBack={ () => router.back() } 
              familyIcon={ publicQuest?.familyIcon?.name }
              likeCount={ likeCount || 0 } 
              isLiked={ isLike }
              onLikeToggle={ likeToggleHandle }
              isLikeLoading={ isLikeLoading || isCancelLikeLoading }
            />
            {/* 編集ボタン（権限がある場合のみ表示） */}
            {hasEditPermission && (
              <Button 
                size="md" 
                radius="xl" 
                color="blue"
                leftSection={<IconEdit size={18} />}
                onClick={openEditModal}
              >
                編集する
              </Button>
            )}
          </Group>
        }
      />
      
      {/* 編集モーダル */}
      {hasEditPermission && (
        <QuestEditModal
          opened={editModalOpened}
          onClose={closeEditModal}
        >
          <PublicQuestEdit id={id} />
        </QuestEditModal>
      )}
    </>
  )
}
