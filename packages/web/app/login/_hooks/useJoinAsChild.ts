"use client"

import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { postJoinChild } from "@/app/api/children/join/client"


/** 子として家族に参加するハンドル */
export const useJoinAsChild = ({refetch, setChildInviteCodeError}: {
  refetch: () => void,
  setChildInviteCodeError: (error: string) => void
}) => {
  /** 子として家族に参加する処理 */
  const mutation = useMutation({
    mutationFn: async ({inviteCode}: {inviteCode: string}) => {
      const data = await postJoinChild({invite_code: inviteCode})
      return data
    },
    onSuccess: () => {
      // ユーザ情報を再取得する
      refetch()
      // フィードバックメッセージを表示する
      toast('子として家族に参加しました', {duration: 1500})
    },
    onError: (err) => {
      throw err
    }
  })

  /** 子として家族に参加するハンドル */
  const handleJoinAsChild = ({inviteCode}: {inviteCode: string}) => {
    if (!inviteCode.trim()) {
      setChildInviteCodeError("子招待コードを入力してください")
      return
    }
    mutation.mutate({inviteCode})
  }

  return {
    handleJoinAsChild,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  }
}
