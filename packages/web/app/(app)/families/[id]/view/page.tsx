"use client"

import { useParams } from "next/navigation"
import { FamilyViewScreen } from "./FamilyViewScreen"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <FamilyViewScreen id={id} />
    </>
  )
}
