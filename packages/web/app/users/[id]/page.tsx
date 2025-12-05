'use client';
import { useParams } from "next/navigation";
import { UserForm } from "./_component/UserForm";

export default function Page() {
  const params = useParams();
  const id = params.id as string

  return (
    <>
      <UserForm id={id} />
    </>
  )
}
