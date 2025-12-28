import { FamilyInviteType } from "../form"
import { devLog } from "@/app/(core)/util"
import toast from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { postFamilyInvite } from "@/app/api/families/invite/client"

export const useSendInviteMail = () => {
    const router = useRouter()

    const mutation = useMutation({
      mutationFn: ({form}: {form: FamilyInviteType}) => postFamilyInvite({form}),
      onSuccess: () => {
        // メール送信完了のメッセージを出力する
        toast("メールの送信が完了しました。")
      },
      onError: (error) => {
        devLog("メール送信に失敗しました: ", error)
        throw error
      }
    })
  return {
    sendInviteMail: mutation.mutate
  }
}
