'use client'

import { useParams } from "next/navigation"
import { TemplateQuestViewScreen } from "./TemplateQuestViewScreen"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <TemplateQuestViewScreen id={id} />
    </>
  )
}
