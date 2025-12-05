"use client"

import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/errorHandler"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { QUESTS_URL } from "@/app/(core)/constants"
import { QuestDelete } from "@/app/api/quests/entity"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useSWR from "swr"
import { useEffect, useState } from "react"
import { isSameArray } from "@/app/(core)/util"
import { questDelete, questGet, questPut } from "../../api/quests/[id]/client"
import { QuestDeleteRequest, QuestPutRequest } from "../../api/quests/[id]/schema"
import { QuestsPostRequest } from "../../api/quests/schema"
import { questsPost } from "../../api/quests/client"
import { QuestFormSchema, QuestFormType } from "./schema"

/** 削除ボタン押下時のハンドル */
export const useQuestDelete = () => {
  const router = useRouter()
  const handleDelete = async (req: QuestDeleteRequest) => {
    try {
      // 削除確認を行う
      if (window.confirm('削除します。よろしいですか？')) {

        // クエストを削除する
        await questDelete(req)

        // 前画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('クエストを削除しました')
          
        // クエスト一覧画面に戻る
        router.push(`${QUESTS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleDelete }
}

/** 新規作成ボタン押下時のハンドル */
export const useQuestSave = () => {
  const router = useRouter()
  const handleSave = async (req: QuestsPostRequest) => {
    try {
      // 登録確認を行う
      if (window.confirm('登録します。よろしいですか？')) {

        // クエストを新規作成する
        await questsPost(req)
    
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('クエストを登録しました')
          
        // クエスト一覧画面に戻る
        router.push(`${QUESTS_URL}`)
      }
    } catch (err) {
      handleAppError(err, router)
    }
  }
  return { handleSave }
}

/** 更新ボタン押下時のハンドル */
export const useQuestUpdate = () => {
  const router = useRouter()
  const handleUpdate = async (req: QuestPutRequest) => {
    try {
      // 更新確認を行う
      if (window.confirm('更新します。よろしいですか？')) {
        // クエストを更新する
        await questPut(req)
        
        // 次画面で表示するメッセージを登録する
        appStorage.feedbackMessage.set('クエストを更新しました')

        // クエスト一覧画面に戻る
        router.push(`${QUESTS_URL}`)
      }
    } catch (error) {
      handleAppError(error, router)
    }
  }

  return { handleUpdate }
}

/** クエストフォームを取得する */
export const useQuestForm = ({id}: {id: number}) => {

  /** クエストフォームのデフォルト値 */
  const defaultQuest: QuestFormType = {
    name: "",
    icon: "",
    tags: [],
  }

  // クエストフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<QuestFormType>({
    resolver: zodResolver(QuestFormSchema),
    defaultValues: defaultQuest
  })

  // IDに紐づくクエストを取得する
  const { data, error, mutate, isLoading } = useSWR(
    id ? ["クエスト", id] : null,
    () => questGet(id)
  )
  const questEntity = data?.quest

  // エラーをチェックする
  if (error) throw error

  /** 取得時のクエストデータ */
  const [fetchedQuest, setFetchedQuest] = useState(defaultQuest)

  // クエストを取得できた場合、状態にセットする
  useEffect(() => {
    if (questEntity != null) {
      // クエストフォームに変換する
      const fetchedQuestForm: QuestFormType = {
        name: questEntity.name,
        icon: questEntity.icon,
        tags: questEntity.quest_tags.map((t) => t.name),
      }
      setFetchedQuest(fetchedQuestForm)
      reset(fetchedQuestForm)
    }
  }, [questEntity])

  /** 現在の入力データ */
  const currentQuests = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentQuests.name !== fetchedQuest.name ||
    currentQuests.icon !== fetchedQuest.icon ||
    !isSameArray(currentQuests.tags, fetchedQuest.tags)

  return {
    register,
    errors,
    setValue,
    watch,
    isValueChanged,
    setForm: reset,
    handleSubmit,
    fetchedQuest,
    refresh: mutate,
    isLoading,
    entity: questEntity
  }
}
