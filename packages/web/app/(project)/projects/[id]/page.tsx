'use client';
import { useParams } from "next/navigation";
import { ProjectForm } from "./_component/ProjectForm";

export default function Page() {
  const params = useParams();
  const id = params.id as string

  return (
    <>
      <ProjectForm id={id} />
    </>
  )
}
