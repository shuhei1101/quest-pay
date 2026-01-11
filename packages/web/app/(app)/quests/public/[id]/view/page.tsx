'use client'

import { useParams } from "next/navigation"
import { PublicQuestView } from "./PublicQuestView"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <PublicQuestView id={id} />
    </>
  )
}
