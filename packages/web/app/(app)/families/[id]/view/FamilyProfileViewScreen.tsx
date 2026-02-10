"use client"

import { useRouter } from "next/navigation"
import { FamilyProfileViewLayout } from "./_components/FamilyProfileViewLayout"
import { FamilyProfileViewFooter } from "./_components/FamilyProfileViewFooter"
import { useFamilyDetail, useFollowStatus, useFollowToggle, useFamilyTimeline } from "./_hooks/useFamilyProfile"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { formatTime } from "@/app/(core)/util"

/** 家族プロフィール画面 */
export const FamilyProfileViewScreen = ({ id }: { id: string }) => {
  const router = useRouter()

  /** ログインユーザー情報を取得する */
  const { userInfo } = useLoginUserInfo()

  /** 家族詳細情報を取得する */
  const { familyDetail, isLoading: isFamilyLoading } = useFamilyDetail({ familyId: id })

  /** フォロー状態を取得する */
  const { isFollowing, isLoading: isFollowLoading } = useFollowStatus({ familyId: id })

  /** フォロー切り替えを行う */
  const { follow, unfollow, isLoading: isFollowToggleLoading } = useFollowToggle({ familyId: id })

  /** 家族タイムラインを取得する */
  const { timelines, isLoading: isTimelineLoading } = useFamilyTimeline({ familyId: id })

  /** 自分の家族かどうかを判定する */
  const isOwnFamily = userInfo?.profiles?.familyId === id

  /** フォローボタン押下時のハンドラ */
  const handleFollowClick = () => {
    if (isFollowing) {
      unfollow()
    } else {
      follow()
    }
  }

  /** タイムラインデータを整形する */
  const formattedTimelines = timelines.map((timeline) => {
    const timelineData = timeline.family_timeline
    return {
      message: timelineData?.message || "",
      time: timelineData?.createdAt ? formatTime(timelineData.createdAt) : "",
    }
  })

  return (
    <FamilyProfileViewLayout
      familyName={familyDetail?.family?.onlineName ?? familyDetail?.family?.localName ?? null}
      displayId={familyDetail?.family?.displayId ?? ""}
      iconName={familyDetail?.icon?.name}
      iconSize={familyDetail?.icon?.size}
      iconColor={familyDetail?.family?.iconColor ?? "#000000"}
      introduction={familyDetail?.family?.introduction ?? ""}
      followerCount={familyDetail?.followCount?.followerCount ?? 0}
      followingCount={familyDetail?.followCount?.followingCount ?? 0}
      publicQuestCount={familyDetail?.stats?.publicQuestCount ?? 0}
      likeCount={familyDetail?.stats?.likeCount ?? 0}
      timelines={formattedTimelines}
      isLoading={isFamilyLoading || isFollowLoading || isTimelineLoading || isFollowToggleLoading}
      isOwnFamily={isOwnFamily}
      isFollowing={isFollowing}
      onFollowClick={handleFollowClick}
      footer={<FamilyProfileViewFooter />}
    />
  )
}
