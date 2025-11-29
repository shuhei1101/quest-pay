'use client';
import { useParams } from "next/navigation";
import { TaskForm } from "./_component/FamilyForm";

export default function Page() {
  const params = useParams();
  const id = params.id as string

  return (
    <>
      <TaskForm id={id} />
    </>
  )
}
