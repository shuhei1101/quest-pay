"use client"

import { useState, useRef, useEffect } from "react"
import { FamilyQuestViewLayout } from "./_components/FamilyQuestViewLayout"
import { useFamilyQuest } from "./_hooks/useFamilyQuest"
import { useRouter } from "next/navigation"
import { SubMenuFAB } from "@/app/(core)/_components/SubMenuFAB"
import { IconEdit } from "@tabler/icons-react"
import { useWindow } from "@/app/(core)/useConstants"
import { Indicator, Paper, Stack, Text } from "@mantine/core"
import { LevelIcon } from "@/app/(core)/_components/LevelIcon"
import { useFABContext } from "@/app/(core)/_components/FABContext"
import { FAMILY_QUEST_EDIT_URL } from "@/app/(core)/endpoints"
import { devLog } from "@/app/(core)/util"

/** 家族クエスト閲覧画面 */
export const FamilyQuestViewScreen = ({id}: {id: string}) => {
  const router = useRouter()
  const { isMobile, isDark } = useWindow()
  /** FABの開閉状態管理 */
  const { openFab, closeFab, isOpen } = useFABContext()
  /** レベル選択メニューの開閉状態 */
  const [levelMenuOpened, setLevelMenuOpened] = useState(false)
  /** レベル選択メニューのref */
  const levelMenuRef = useRef<HTMLDivElement>(null)
  
  /** 選択中のレベル */
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  /** 現在のクエスト状態 */
  const {familyQuest, isLoading} = useFamilyQuest({id})

  /** 選択中のレベルの詳細を取得する */
  const selectedDetail = familyQuest?.details?.find(d => d.level === selectedLevel) || familyQuest?.details?.[0]

  /** 利用可能なレベル一覧を取得する */
  const availableLevels = familyQuest?.details?.map(d => d.level).filter((level): level is number => level !== null && level !== undefined) || []

  devLog("FamilyQuestViewScreen.レンダリング状態: ", {
    isLoading,
    hasFamilyQuest: !!familyQuest,
    questName: familyQuest?.quest?.name,
    iconName: familyQuest?.icon?.name,
    iconSize: familyQuest?.icon?.size,
    iconColor: familyQuest?.quest?.iconColor,
    selectedLevel,
    hasSelectedDetail: !!selectedDetail,
    selectedDetailLevel: selectedDetail?.level,
    selectedDetailReward: selectedDetail?.reward,
    availableLevelsCount: availableLevels.length,
    detailsCount: familyQuest?.details?.length,
    tagsCount: familyQuest?.tags?.length,
    details: familyQuest?.details,
    tags: familyQuest?.tags,
    icon: familyQuest?.icon
  })

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

  return (
    <>
    <FamilyQuestViewLayout
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
      requiredClearCount={selectedDetail?.requiredClearCount ?? null}
      availableLevels={availableLevels}
      onLevelChange={handleLevelChange}
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

      {/* FAB */}
      <SubMenuFAB
        items={[
          {
            icon: <IconEdit size={20} />,
            label: "編集",
            onClick: () => router.push(FAMILY_QUEST_EDIT_URL(id)),
          },
          ...(availableLevels.length > 1 ? [{
            icon: (
              <Indicator label={selectedLevel} size={18} color="orange" offset={4}>
                <LevelIcon size={20} />
              </Indicator>
            ),
            label: "レベル",
            onClick: () => {
              closeFab("family-quest-fab")
              setLevelMenuOpened(true)
            },
          }] : []),
        ]}
        open={isOpen("family-quest-fab")}
        onToggle={(open) => open ? openFab("family-quest-fab") : closeFab("family-quest-fab")}
      />
    </>
  )
}
