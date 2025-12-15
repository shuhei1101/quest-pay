"use client"

import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"


/** 親として家族に参加するハンドル */
export const useJoinAsParent = ({refetch, setParentInviteCodeError}: {
  refetch: () => void,
  setParentInviteCodeError: (error: string) => void
}) => {
  /** 親として家族に参加する処理 */
  const mutation = useMutation({
    mutationFn: async ({inviteCode}: {inviteCode: string}) => {
      // TODO: 親として家族に参加するAPI実装後に置き換える
      // const data = await postJoinParent({invite_code: inviteCode})
      // return data
      console.log("親として参加: ", inviteCode)
    },
    onSuccess: () => {
      // ユーザ情報を再取得する
      refetch()
      // フィードバックメッセージを表示する
      toast('親として家族に参加しました', {duration: 1500})
    },
    onError: (err) => {
      throw err
    }
  })

  /** 親として家族に参加するハンドル */
  const handleJoinAsParent = ({inviteCode}: {inviteCode: string}) => {
    if (!inviteCode.trim()) {
      setParentInviteCodeError("親招待コードを入力してください")
      return
    }
    mutation.mutate({inviteCode})
  }

  return {
    handleJoinAsParent,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  }
}
