import { postFamilyInvite } from "@/app/api/families/invite/client"
import { FamilyInviteType } from "../form"
import { devLog } from "@/app/(core)/util"
import toast from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { useRouter } from "next/navigation"

export const useSendInviteMail = () => {
    const router = useRouter()

    const mutation = useMutation({
      mutationFn: ({form}: {form: FamilyInviteType}) => postFamilyInvite({
        email: form.email
      }),
      onSuccess: () => {
        // メール送信完了のメッセージを出力する
        toast("メールの送信が完了しました。")
      },
      onError: (error) => {
        devLog("メール送信に失敗しました: ", error)
        handleAppError(error, router)
      }
    })
  return {
    sendInviteMail: mutation.mutate
  }
}
