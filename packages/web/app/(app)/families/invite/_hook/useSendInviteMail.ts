import { postFamilyInvite } from "@/app/api/families/invite/client"
import { FamilyInviteType } from "../form"
import { devLog } from "@/app/(core)/util"
import toast from "react-hot-toast"

export const useSendInviteMail = () => {
  
  const sendInviteMail = async ({form}: {
    form: FamilyInviteType
  }) => {
    try {
      // メールを送信する
      await postFamilyInvite({
        email: form.email
      })
      // メール送信完了のメッセージを出力する
      toast("メールの送信が完了しました。")
    } catch(error) {
      devLog("メール送信に失敗しました: ", error)
      toast("メール送信に失敗しました")
    }
  }
  return {sendInviteMail}
}
