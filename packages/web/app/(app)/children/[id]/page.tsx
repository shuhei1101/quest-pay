'use client'

import { useParams } from "next/navigation"
import { ChildForm } from "./_components/ChildEdit"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <ChildForm id={id} />
    </>
  )
}
