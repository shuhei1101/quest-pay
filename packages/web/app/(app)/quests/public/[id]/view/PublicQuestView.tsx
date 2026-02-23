"use client"

import { useState, useEffect, useRef } from "react"
import { PublicQuestViewLayout } from "./_components/PublicQuestViewLayout"
import { useWindow } from "@/app/(core)/useConstants"
import { useTheme } from "@/app/(core)/_theme/useTheme"
import { usePublicQuest } from "./_hooks/usePublicQuest"
import { useRouter } from "next/navigation"
import { useLikeQuest } from "./_hooks/useLikeQuest"
import { useLikeCount } from "./_hooks/useLikeCount"
import { useIsLike } from "./_hooks/useIsLike"
import { useCancelQuestLike } from "./_hooks/useCancelQuestLike"
import { useCommentsCount } from "../comments/_hooks/useCommentsCount"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { useDisclosure } from "@mantine/hooks"
import { QuestEditModal } from "../../../_components/QuestEditModal"
import { PublicQuestEdit } from "../PublicQuestEdit"
import { FloatingActionButton } from "@/app/(core)/_components/FloatingActionButton"
import { useFABContext } from "@/app/(core)/_components/FABContext"
import { IconArrowLeft, IconHeart, IconHeartFilled } from "@tabler/icons-react"
import { Indicator, Paper, Stack, Text } from "@mantine/core"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { LevelIcon } from "@/app/(core)/_components/LevelIcon"

/** 公開クエスト閲覧画面 */
export const PublicQuestView = ({id}: {id: string}) => {
  const router = useRouter()
  const { isMobile, isDark } = useWindow()
  const { colors: themeColors } = useTheme()
  /** FABの開閉状態管理 */
  const { openFab, closeFab, isOpen } = useFABContext()
  /** レベル選択メニューの開閉状態 */
  const [levelMenuOpened, setLevelMenuOpened] = useState(false)
  /** レベル選択メニューのref */
  const levelMenuRef = useRef<HTMLDivElement>(null)
  
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

  /** コメント数 */
  const { count: commentCount } = useCommentsCount({ publicQuestId: id })

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

  /** レベル変更時のハンドル */
  const handleLevelChange = (level: number) => {
    setSelectedLevel(level)
    setLevelMenuOpened(false)
  }

  /** レベル選択メニューの外側をクリックしたら閉じる */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (levelMenuRef.current && !levelMenuRef.current.contains(event.target as Node)) {
        setLevelMenuOpened(false)
      }
    }

    if (levelMenuOpened) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [levelMenuOpened])

  /** マウント時にFABを開く */
  useEffect(() => {
    openFab("public-quest-fab")
  }, [])

  return (
    <>
      <PublicQuestViewLayout
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
        requiredClearCount={selectedDetail?.requiredClearCount ?? null}
        commentCount={commentCount}
        publicQuestId={id}
      />

      {/* FAB */}
      <FloatingActionButton
        items={[
          {
            icon: <IconArrowLeft size={20} />,
            label: "戻る",
            onClick: () => router.back(),
          },
          {
            icon: (
              <Indicator label={likeCount || 0} size={18} color="red" offset={4}>
                {isLike ? (
                  <IconHeartFilled size={20} />
                ) : (
                  <IconHeart size={20} />
                )}
              </Indicator>
            ),
            label: "いいね",
            onClick: likeToggleHandle,
            color: isLike ? "red" : "gray",
          },
          {
            icon: <RenderIcon iconName={publicQuest?.familyIcon?.name} iconSize={20} />,
            label: "家族",
            onClick: () => {}, // 将来的に家族ページへ遷移
          },
          ...(availableLevels.length > 1 ? [{
            icon: (
              <Indicator label={selectedLevel} size={18} color="blue" offset={4}>
                <LevelIcon size={20} />
              </Indicator>
            ),
            label: "レベル",
            onClick: () => {
              closeFab("public-quest-fab")
              setLevelMenuOpened(true)
            },
          }] : []),
        ]}
        position="bottom-right"
        open={isOpen("public-quest-fab")}
        onToggle={(open) => open ? openFab("public-quest-fab") : closeFab("public-quest-fab")}
      />

      {/* レベル選択メニュー（レベル選択ボタンをクリックしたときに表示） */}
      {availableLevels.length > 1 && levelMenuOpened && (
        <div 
          ref={levelMenuRef}
          style={{ 
            position: "fixed", 
            bottom: "90px", 
            right: isMobile ? "20px" : "40px", 
            zIndex: 3001 
          }}
        >
          <Paper 
            shadow="md" 
            p="xs" 
            radius="md" 
            withBorder
            style={{
              backgroundColor: isDark ? "#2C2E33" : "#FFFFFF",
            }}
          >
            <Stack gap="xs">
              <Text size="xs" fw={600} c="dimmed" px="xs">
                レベルを選択
              </Text>
              {availableLevels.map((level) => (
                <Paper
                  key={level}
                  p="xs"
                  radius="md"
                  style={{
                    cursor: "pointer",
                    backgroundColor: level === selectedLevel 
                      ? (isDark ? "rgba(255, 159, 0, 0.2)" : "rgba(255, 159, 0, 0.1)")
                      : (isDark ? "transparent" : "transparent"),
                    fontWeight: level === selectedLevel ? "bold" : undefined,
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (level !== selectedLevel) {
                      e.currentTarget.style.backgroundColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (level !== selectedLevel) {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                  onClick={() => handleLevelChange(level)}
                >
                  <Text size="sm">レベル {level}</Text>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </div>
      )}
      
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
