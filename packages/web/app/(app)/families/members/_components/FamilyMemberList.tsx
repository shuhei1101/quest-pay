"use client"
import { useRouter } from "next/navigation"
import { Stack, Text, Divider, Card } from "@mantine/core"
import { ChildCardLayout } from "../../../children/_components/ChildCardLayout"
import { useChildren } from "@/app/(app)/children/_hook/useChildren"
import { useParents } from "@/app/(app)/parents/_hook/useParents"
import { ParentCardLayout } from "@/app/(app)/parents/_components/ParentCardLayout"
import { FAMILIES_MEMBERS_CHILD_VIEW_URL, FAMILIES_MEMBERS_PARENT_VIEW_URL } from "@/app/(core)/endpoints"

export const FamilyMemberList = ({selectedId}: {selectedId: string | null}) => {
  const router = useRouter() 

  /** 親一覧 */
  const { parents } = useParents()
  /** 子供一覧 */
  const { children, questStats } = useChildren()

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ height: "100%" }}>
      <Stack gap={4}>
        {/* 親セクション */}
        <Text size="xs" fw={600} c="dimmed" px="xs" py={4}>親</Text>
        {parents.map((parent, index) => (
          <ParentCardLayout 
            key={ index } 
            parent={ parent } 
            isSelected={selectedId === parent.parents.id}
            onClick={(parentId) => {
              router.push(FAMILIES_MEMBERS_PARENT_VIEW_URL(parentId)) // 親閲覧画面へ遷移する
            }}
          />
        ))}
        
        <Divider my={4} />
        
        {/* 子供セクション */}
        <Text size="xs" fw={600} c="dimmed" px="xs" py={4}>子供</Text>
        {children.map((child, index) => (
          <ChildCardLayout 
            key={ index } 
            child={ child } 
            questStats={child.children ? questStats[child.children.id] : undefined}
            isSelected={selectedId === child.children.id}
            onClick={(childId) => {
              router.push(FAMILIES_MEMBERS_CHILD_VIEW_URL(childId)) // 子供閲覧画面へ遷移する
            }}
          />
        ))}
      </Stack>
    </Card>
  )
}
