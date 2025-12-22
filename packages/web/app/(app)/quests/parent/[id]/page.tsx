'use client'

import { useParams } from "next/navigation"
import { FamilyQuestForm } from "./FamilyQuestForm"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <FamilyQuestForm id={id} />
    </>
  )
}
