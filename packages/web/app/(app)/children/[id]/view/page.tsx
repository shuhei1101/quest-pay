'use client'

import { useParams } from "next/navigation"
import { ChildView } from "../_components/ChildView"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <ChildView id={id} />
    </>
  )
}
