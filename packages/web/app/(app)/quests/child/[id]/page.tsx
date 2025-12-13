'use client'

import { useParams } from "next/navigation";
import { FamilyQuestForm } from "./_component/FamilyQuestForm";

export default function Page() {
  const params = useParams();
  const id = params.id as string

  return (
    <>
      <FamilyQuestForm id={id} />
    </>
  )
}
