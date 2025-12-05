'use client';
import { useParams } from "next/navigation";
import { QuestForm } from "./_component/QuestForm";

export default function Page() {
  const params = useParams();
  const id = params.id as string

  return (
    <>
      <QuestForm id={id} />
    </>
  )
}
