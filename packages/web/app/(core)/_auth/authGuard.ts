import { getLoginUserInfo } from "@/app/login/_service/getLoginUserInfo"
import { ClientAuthError } from "../error/appError"

export const AuthGuard = async ({parentNG, childNG, guestNG}: {
  parentNG?: boolean
  childNG?: boolean
  guestNG?: boolean
}) => {
  const { userInfo, isGuest, isChild, isParent } = await getLoginUserInfo()

  if ((parentNG && isParent) || 
  (childNG && isChild) || 
  (guestNG && isGuest)) throw new ClientAuthError("画面の閲覧権限がありません。")
  
  return { userInfo }
}
