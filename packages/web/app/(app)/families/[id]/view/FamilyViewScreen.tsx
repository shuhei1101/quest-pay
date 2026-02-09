"use client"

import { useRouter } from "next/navigation"
import { FamilyViewLayout } from "./_components/FamilyViewLayout"
import { useFamilyProfile } from "./_hooks/useFamilyProfile"

/** 家族プロフィール閲覧画面 */
export const FamilyViewScreen = ({id}: {id: string}) => {
  const router = useRouter()
  
  /** 家族プロフィール情報を取得する */
  const {profile, isLoading} = useFamilyProfile({familyId: id})

  /** 戻るボタンのハンドラ */
  const handleBack = () => {
    router.back()
  }

  // 家族情報を取得する
  const family = profile?.family.families

  return (
    <FamilyViewLayout
      familyName={family?.onlineName || family?.localName || ""}
      familyHandle={family?.displayId || ""}
      introduction={family?.introduction || ""}
      iconColor={family?.iconColor || ""}
      publicQuestCount={Number(profile?.publicQuestCount) || 0}
      likeCount={Number(profile?.likeCount) || 0}
      timelines={profile?.timelines || []}
      isLoading={isLoading}
      onBack={handleBack}
    />
  )
}
