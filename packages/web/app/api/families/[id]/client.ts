import { appFetch } from "@/app/(core)/appFetch"
import { FAMILY_PROFILE_API_URL } from "@/app/(core)/endpoints"
import { GetFamilyProfileResponse } from "./route"

/** 家族プロフィール情報を取得する */
export const getFamilyProfile = async ({familyId}: {
  familyId: string
}) => {
  const response = await appFetch(FAMILY_PROFILE_API_URL(familyId), {
    method: "GET",
  })
  return response.json() as Promise<GetFamilyProfileResponse>
}
