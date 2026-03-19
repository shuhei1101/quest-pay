'use client'

import { Box, Button } from "@mantine/core"
import { useState } from "react"
import { FamilyProfileViewLayout } from "./FamilyProfileViewLayout"
import { PageHeader } from "@/app/(core)/_components/PageHeader"

/** モック用の家族データ型 */
type MockFamilyProfile = {
  id: string
  displayId: string
  localName: string
  onlineName: string | null
  introduction: string
  iconId: number
  iconName: string
  iconColor: string
  createdAt: string
  memberStats: {
    parentCount: number
    childCount: number
  }
  questStats: {
    totalCount: number
    completedCount: number
    inProgressCount: number
  }
}

/** サンプルデータ */
const mockFamily: MockFamilyProfile = {
  id: "mock-family-id-001",
  displayId: "tanaka-family",
  localName: "田中家",
  onlineName: "たなかファミリー",
  introduction: "みんなで協力して楽しくクエストをこなそう！家族の絆を大切にしています。",
  iconId: 1,
  iconName: "IconHome",
  iconColor: "#667eea",
  createdAt: "2024-01-15T10:00:00Z",
  memberStats: {
    parentCount: 2,
    childCount: 3,
  },
  questStats: {
    totalCount: 125,
    completedCount: 98,
    inProgressCount: 27,
  },
}

/** 家族プロフィール画面モック */
export const FamilyProfileMock = () => {
  const [family] = useState<MockFamilyProfile>(mockFamily)

  return (
    <Box p="md">
      <PageHeader title="家族プロフィール" showProfileButton={false} />
      
      {/* トップバー */}
      <div className="flex items-center gap-3 justify-end mb-4">
        <Button 
          variant="filled"
        >
          編集
        </Button>
      </div>
      
      {/* 家族プロフィールレイアウト */}
      <FamilyProfileViewLayout
        family={family}
      />
    </Box>
  )
}
