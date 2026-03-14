"use client"

import { useState, useRef, useEffect } from "react"
import { TemplateQuestViewLayout } from "./_components/TemplateQuestViewLayout"
import { useTemplateQuest } from "./_hooks/useTemplateQuest"
import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { FAMILY_QUEST_NEW_URL, PUBLIC_QUEST_URL } from "@/app/(core)/endpoints"
import toast from "react-hot-toast"
import { SubMenuFAB } from "@/app/(core)/_components/SubMenuFAB"
import { IconFilePencil, IconFileSearch, IconTrash } from "@tabler/icons-react"
import { useWindow } from "@/app/(core)/useConstants"
import { Indicator, Paper, Stack, Text } from "@mantine/core"
import { LevelIcon } from "@/app/(core)/_components/LevelIcon"
import { useFABContext } from "@/app/(core)/_components/FABContext"

/** テンプレートクエスト閲覧画面 */
export const TemplateQuestViewScreen = ({id}: {id: string}) => {
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
  const {templateQuest, isLoading} = useTemplateQuest({id})

  /** 選択中のレベルの詳細を取得する */
  const selectedDetail = templateQuest?.details?.find(d => d.level === selectedLevel) || templateQuest?.details?.[0]

  /** 利用可能なレベル一覧を取得する */
  const availableLevels = templateQuest?.details?.map(d => d.level).filter((level): level is number => level !== null && level !== undefined) || []

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
      childSettings: [],
    })

    // 家族クエスト作成画面へ遷移する
    router.push(FAMILY_QUEST_NEW_URL)
  }

  /** 元のクエストを確認するハンドル */
  const onCheckSource = () => {
    if (templateQuest?.publicQuest) {
      router.push(PUBLIC_QUEST_URL(templateQuest.publicQuest.id))
    } else {
      toast.error("元のクエスト情報が見つかりません。")
    }
  }

  return (
    <>
      <TemplateQuestViewLayout
        questName={templateQuest?.quest?.name || ""}
        headerColor={{ light: "yellow.3", dark: "yellow.8" }}
        backgroundColor={{ 
          light: "rgba(254, 243, 199, 0.5)", 
          dark: "rgba(161, 98, 7, 0.2)" 
        }}
        iconColor={templateQuest?.quest?.iconColor}
        iconName={templateQuest?.icon?.name}
        iconSize={templateQuest?.icon?.size ?? 48}
        isLoading={isLoading}
        level={selectedDetail?.level || 1}
        category={""}
        successCondition={selectedDetail?.successCondition || ""}
        reward={selectedDetail?.reward || 0}
        exp={selectedDetail?.childExp || 0}
        requiredCompletionCount={selectedDetail?.requiredCompletionCount || 0}
        client={templateQuest?.quest?.client || ""}
        requestDetail={templateQuest?.quest?.requestDetail || ""}
        tags={templateQuest?.tags?.map(tag => tag.name) || []}
        ageFrom={templateQuest?.quest?.ageFrom}
        ageTo={templateQuest?.quest?.ageTo}
        monthFrom={templateQuest?.quest?.monthFrom}
        monthTo={templateQuest?.quest?.monthTo}
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
            icon: <IconFilePencil size={20} />,
            label: "作成",
            onClick: onCreateFromTemplate,
            color: "blue",
          },
          ...(templateQuest?.base.publicQuestId ? [{
            icon: <IconFileSearch size={20} />,
            label: "元のクエスト",
            onClick: onCheckSource,
            color: "gray",
          }] : []),
          {
            icon: <IconTrash size={20} />,
            label: "削除",
            onClick: onDelete,
            color: "red",
          },
          ...(availableLevels.length > 1 ? [{
            icon: (
              <Indicator label={selectedLevel} size={18} color="yellow" offset={4}>
                <LevelIcon size={20} />
              </Indicator>
            ),
            label: "レベル",
            onClick: () => {
              closeFab("template-quest-fab")
              setLevelMenuOpened(true)
            },
          }] : []),
        ]}
        open={isOpen("template-quest-fab")}
        onToggle={(open) => open ? openFab("template-quest-fab") : closeFab("template-quest-fab")}
        pattern={isMobile ? "radial-up" : "radial-left"}
      />
    </>
  )
}
