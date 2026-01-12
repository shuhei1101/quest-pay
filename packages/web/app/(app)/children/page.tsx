"use client"

import { useState } from "react"
import { FamilyMemberList } from "../families/members/_components/FamilyMemberList"
import { ChildForm } from "./[id]/_components/ChildEdit"

export default function Page() {
  const [] = useState()

  return (
    <>
      <div className="flex h-screen w-screen gap-3">
        <div className="w-1/2 max-h-full">
          <FamilyMemberList selectedId={null} />

        </div>
        <div className="w-1/2 h-full">
          <ChildForm />
        </div>
      </div>
    </>
  )
}
