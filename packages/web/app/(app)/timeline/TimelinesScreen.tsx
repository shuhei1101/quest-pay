"use client"

import { useState } from "react"
import { Paper, Text, Loader, Center, Stack } from "@mantine/core"
import { IconHome2, IconWorld, IconClipboard, IconUsers, IconEdit } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { NavigationFAB, NavigationItem } from "@/app/(core)/_components/NavigationFAB"
import { useFamilyTimelines } from "./_hooks/useFamilyTimelines"
import { usePublicTimelines } from "./_hooks/usePublicTimelines"
import { TimelineItem } from "./_components/TimelineItem"
import { PublicTimelineItem } from "./_components/PublicTimelineItem"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { HOME_URL, QUESTS_URL, FAMILY_MEMBERS_URL, FAMILY_QUEST_NEW_URL } from "@/app/(core)/endpoints"

export const TimelinesScreen = () => {
  const router = useRouter()
  const {isChild, isParent} = useLoginUserInfo()

  const [activeTab, setActiveTab] = useState<string>("family")

  /** 家族タイムライン取得 */
  const { data: familyTimelines, isLoading: isFamilyLoading } = useFamilyTimelines()

  /** 公開タイムライン取得 */
  const { data: publicTimelines, isLoading: isPublicLoading } = usePublicTimelines()

  /** タブの定義（子供ユーザーの場合は家族タブのみ） */
  const tabs = [
    {
      value: "family",
      label: "家族",
      icon: <IconHome2 size={18} />,
      color: "rgb(74, 222, 128)",
    },
    ...(!isChild ? [{
      value: "public",
      label: "公開",
      icon: <IconWorld size={18} />,
      color: "rgb(96 165 250)",
    }] : []),
  ]

  /** ナビゲーションアイテム */
  const navigationItems: NavigationItem[] = [
    { 
      icon: <IconHome2 size={20} />,
      label: "ホーム",
      onClick: () => router.push(HOME_URL)
    },
    { 
      icon: <IconClipboard size={20} />,
      label: "クエスト",
      onClick: () => router.push(QUESTS_URL)
    },
    ...(isParent ? [{ 
      icon: <IconUsers size={20} />,
      label: "メンバー",
      onClick: () => router.push(FAMILY_MEMBERS_URL)
    }] : []),
    { 
      icon: <IconEdit size={20} />,
      label: "新規作成",
      onClick: () => router.push(FAMILY_QUEST_NEW_URL)
    },
  ]

  /** 現在のタブに基づいてナビゲーションの選択インデックスを決定する */
  const getActiveNavigationIndex = () => {
    // タイムライン画面（ホーム）にいるので、ホームアイテムを選択
    return 0
  }

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '100px' }}>
      {/* ヘッダータイトル */}
      <Paper p="md" withBorder shadow="sm" mb="md">
        <Text size="xl" fw={700}>タイムライン</Text>
      </Paper>

      {/* タブコンポーネント */}
      <ScrollableTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(value) => value && setActiveTab(value)}
      >
      {/* タイムラインコンテンツ */}
      <div style={{ padding: '16px' }}>
        {activeTab === "family" && (
          <div>
            {/* 家族タイムライン */}
            {isFamilyLoading ? (
              <Center h={200}>
                <Loader />
              </Center>
            ) : (
              <Stack gap="md">
                {familyTimelines && familyTimelines.length > 0 ? (
                  familyTimelines.map((timeline) => (
                    <TimelineItem
                      key={timeline.family_timeline.id}
                      profileName={timeline.profiles?.name}
                      profileIconColor={timeline.profiles?.iconColor}
                      message={timeline.family_timeline.message}
                      createdAt={timeline.family_timeline.createdAt}
                      url={timeline.family_timeline.url}
                    />
                  ))
                ) : (
                  <Center h={200}>
                    <Text c="dimmed">タイムラインがありません</Text>
                  </Center>
                )}
              </Stack>
            )}
          </div>
        )}

        {activeTab === "public" && (
          <div>
            {/* 公開タイムライン */}
            {isPublicLoading ? (
              <Center h={200}>
                <Loader />
              </Center>
            ) : (
              <Stack gap="md">
                {publicTimelines && publicTimelines.length > 0 ? (
                  publicTimelines.map((timeline) => (
                    <PublicTimelineItem
                      key={timeline.public_timeline.id}
                      familyOnlineName={timeline.families?.onlineName}
                      familyIconColor={timeline.families?.iconColor}
                      message={timeline.public_timeline.message}
                      createdAt={timeline.public_timeline.createdAt}
                      url={timeline.public_timeline.url}
                    />
                  ))
                ) : (
                  <Center h={200}>
                    <Text c="dimmed">タイムラインがありません</Text>
                  </Center>
                )}
              </Stack>
            )}
          </div>
        )}
      </div>
      </ScrollableTabs>
    </div>

    {/* GitHub mobile風のナビゲーションFAB */}
    <NavigationFAB
      items={navigationItems}
      activeIndex={getActiveNavigationIndex()}
      mainButtonColor="blue"
      subButtonColor="blue"
    />
    </>
  )
}
