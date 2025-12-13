'use client'

import { useParams } from "next/navigation"
import { ChildForm } from "../[id]/_components/ChildForm"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  return (
    <>
      <ChildForm id={id} />
    </>
  )
}
