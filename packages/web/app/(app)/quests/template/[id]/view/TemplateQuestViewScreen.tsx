"use client"

import { useState } from "react"
import { TemplateQuestViewLayout } from "./_components/TemplateQuestViewLayout"
import { useTemplateQuest } from "./_hooks/useTemplateQuest"
import { useRouter } from "next/navigation"
import { TemplateQuestViewFooter } from "./_components/TemplateQuestViewFooter"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { FAMILY_QUEST_NEW_URL, PUBLIC_QUEST_URL } from "@/app/(core)/endpoints"
import toast from "react-hot-toast"

/** テンプレートクエスト閲覧画面 */
export const TemplateQuestViewScreen = ({id}: {id: string}) => {
  const router = useRouter()
  
  /** 選択中のレベル */
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  /** 現在のクエスト状態 */
  const {templateQuest, isLoading} = useTemplateQuest({id})

  /** 選択中のレベルの詳細を取得する */
  const selectedDetail = templateQuest?.details?.find(d => d.level === selectedLevel) || templateQuest?.details?.[0]

  /** 利用可能なレベル一覧を取得する */
  const availableLevels = templateQuest?.details?.map(d => d.level).filter((level): level is number => level !== null && level !== undefined) || []

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

  /** コメント数（TODO: 実装時にAPIから取得する） */
  const commentCount = 0

  return (
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
      footer={
        <TemplateQuestViewFooter 
          availableLevels={ availableLevels }
          selectedLevel={ selectedLevel }
          onLevelChange={ setSelectedLevel }
          onBack={ () => router.back() } 
          familyIcon={ templateQuest?.familyIcon?.name }
          onDelete={ onDelete }
          onCreateFromTemplate={ onCreateFromTemplate }
          onCheckSource={ onCheckSource }
          hasSourceQuest={ !!templateQuest?.base.publicQuestId }
        />
      }
    />
  )
}
