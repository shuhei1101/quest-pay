'use client'

import { useParams } from "next/navigation"
import { FamilyQuestViewScreen } from "./FamilyQuestViewScreen"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <FamilyQuestViewScreen id={id} />
    </>
  )
}
