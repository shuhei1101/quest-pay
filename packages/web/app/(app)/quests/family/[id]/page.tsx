'use client'

import { useParams } from "next/navigation"
import { FamilyQuestEdit } from "./FamilyQuestEdit"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <FamilyQuestEdit id={id} />
    </>
  )
}
