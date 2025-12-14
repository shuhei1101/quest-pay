"use client"
import { useRouter } from "next/navigation"
import { SimpleGrid } from "@mantine/core"
import { ChildCardLayout } from "../../../children/_components/ChildCardLayout"
import { useChildren } from "@/app/(app)/children/_hook/useChildren"
import { useParents } from "@/app/(app)/parents/_hook/useParents"
import { ParentCardLayout } from "@/app/(app)/parents/_components/ParentCardLayout"
import { FAMILIES_MEMBERS_CHILD_VIEW_URL, FAMILIES_MEMBERS_PARENT_VIEW_URL } from "@/app/(core)/constants"

export const FamilyMemberList = () => {
  const router = useRouter() 

  /** 親一覧 */
  const { parents } = useParents()
  /** 子供一覧 */
  const { children } = useChildren()

  return (
    <>
      {/* リスト */}
      <div className="flex flex-col gap-3">
        <SimpleGrid
          cols={1}
          spacing="md" >
            {parents.map((parent, index) => (
              <ParentCardLayout key={ index } parent={ parent } onClick={(parentId) => router.push(FAMILIES_MEMBERS_PARENT_VIEW_URL(parentId))} />
            ))}
        </SimpleGrid>
        <SimpleGrid
          cols={1}
          spacing="md" >
            {children.map((child, index) => (
              <ChildCardLayout key={ index } child={ child } onClick={(childId) => router.push(FAMILIES_MEMBERS_CHILD_VIEW_URL(childId))} />
            ))}
        </SimpleGrid>
      </div>
    </>
  )
}
