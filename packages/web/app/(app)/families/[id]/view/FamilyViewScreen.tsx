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

  return (
    <FamilyViewLayout
      familyName={profile?.family.families?.onlineName || profile?.family.families?.localName || ""}
      familyHandle={profile?.family.families?.displayId || ""}
      introduction={profile?.family.families?.introduction || ""}
      iconColor={profile?.family.families?.iconColor || ""}
      iconName={profile?.family.icons?.name}
      publicQuestCount={Number(profile?.publicQuestCount) || 0}
      likeCount={Number(profile?.likeCount) || 0}
      timelines={profile?.timelines || []}
      isLoading={isLoading}
      onBack={handleBack}
    />
  )
}
