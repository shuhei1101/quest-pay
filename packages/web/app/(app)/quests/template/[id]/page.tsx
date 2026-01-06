'use client'

import { useParams } from "next/navigation"
import { TemplateQuestEdit } from "./TemplateQuestEdit"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <TemplateQuestEdit id={id} />
    </>
  )
}
