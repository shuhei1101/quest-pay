import { authGuard } from "@/app/(core)/_auth/authGuard"
import { HOME_URL } from "@/app/(core)/endpoints"
import { FamilyProfileViewScreen } from "./FamilyProfileViewScreen"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // 親のみアクセス可能、子供・ゲストは不可
  await authGuard({ childNG: true, guestNG: true, redirectUrl: HOME_URL })

  return <FamilyProfileViewScreen id={id} />
}
