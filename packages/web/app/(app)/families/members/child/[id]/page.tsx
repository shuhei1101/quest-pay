'use client'

import { ChildForm } from "@/app/(app)/children/[id]/_components/ChildEdit"
import { useParams } from "next/navigation"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <ChildForm id={id} />
    </>
  )
}
