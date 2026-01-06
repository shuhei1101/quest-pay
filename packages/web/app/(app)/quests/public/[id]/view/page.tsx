'use client'

import { useParams } from "next/navigation"
import { PublicQuestViewScreen } from "./PublicQuestViewScreen"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <PublicQuestViewScreen id={id} />
    </>
  )
}
