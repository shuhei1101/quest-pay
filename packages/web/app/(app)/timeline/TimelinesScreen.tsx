"use client"

import { useState } from "react"
import { Paper, Text, Loader, Center, Stack } from "@mantine/core"
import { IconHome2, IconWorld } from "@tabler/icons-react"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { useFamilyTimelines } from "./_hooks/useFamilyTimelines"
import { usePublicTimelines } from "./_hooks/usePublicTimelines"
import { TimelineItem } from "./_components/TimelineItem"
import { PublicTimelineItem } from "./_components/PublicTimelineItem"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"

export const TimelinesScreen = () => {
  const {isChild} = useLoginUserInfo()

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

  return (
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

  )
}
