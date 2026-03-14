import { FamilyInviteType } from "../form"
import { logger } from "@/app/(core)/logger"
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
        logger.error("メール送信失敗", { error })
        throw error
      }
    })
  return {
    sendInviteMail: mutation.mutate
  }
}
