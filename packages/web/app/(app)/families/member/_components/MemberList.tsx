"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { FAMILY_QUEST_URL, FAMILY_QUESTS_URL, LOGIN_URL } from "@/app/(core)/constants"
import { SimpleGrid, Tabs, Button, Text, Input, ActionIcon, Box, Paper } from "@mantine/core"
import { useQuestCategories } from "@/app/api/quests/category/_hook/useQuestCategories"
import { useDisclosure, useIntersection } from "@mantine/hooks"
import { devLog } from "@/app/(core)/util"
import { IconArrowsSort, IconFilter, IconLogout, IconSearch } from "@tabler/icons-react"
import { useConstants } from "@/app/(core)/useConstants"
import { useSwipeable } from "react-swipeable"
import { ChildCardLayout, MemberCardLayout } from "../../../children/_components/MemberCardLayout"

export const MemberList = () => {
  const router = useRouter() 

  /** 画面定数 */
  const { isMobile, isTablet, isDesktop } = useConstants()

  /** 親一覧 */
  const { fetchedParents, isLoading } = useParents()
  /** 子供一覧 */
  const { fetchedChildren, isLoading } = useChildren()

  return (
    <>
      {/* 全件表示 */}
      <SimpleGrid
        cols={isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4}
        spacing="md" >
          {fetchedChildren.map((child, index) => (
            <ChildCardLayout key={index} child={child} />
          ))}
      </SimpleGrid>
    </>
  )
}
