'use client'

import { ChildView } from "@/app/(app)/children/[id]/_components/ChildView"
import { useParams } from "next/navigation"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <ChildView id={id} />
    </>
  )
}
