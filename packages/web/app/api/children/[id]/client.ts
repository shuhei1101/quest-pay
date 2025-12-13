import { handleAPIError } from "@/app/(core)/errorHandler";
import { CHILD_API_URL } from "@/app/(core)/constants";
import { devLog } from "@/app/(core)/util";
import { GetChildResponseSchema } from "./schema";


/** 子供を取得する */
export const getChild = async (questId: string) => {
  devLog("getChild.実行API: ", `${CHILD_API_URL(questId)}`)
  // APIを実行する
  const res = await fetch(`${CHILD_API_URL(questId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }

  devLog("getChild.取得データ: ", `${CHILD_API_URL(questId)}`)

  const data = await res.json()

  return GetChildResponseSchema.parse(data)
}

// /** 子供を更新する */
// export const putChild = async (req: PutChildRequest) => {
//   // APIを実行する
//   const res = await fetch(`${FAMILY_QUEST_API_URL(req.quest.id)}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(req)
//   })

//   // ステータスが不正な場合、アプリ例外を発生させる
//   if (!res.ok) {
//     await handleAPIError(res)
//   }
// }

// // 子供を削除する
// export const deleteChild = async (req: DeleteChildRequest) => {
//   // APIを実行する
//   const res = await fetch(`${FAMILY_QUEST_API_URL(req.quest.id)}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(req)
//   })

//   // ステータスが不正な場合、アプリ例外を発生させる
//   if (!res.ok) {
//     await handleAPIError(res)
//   }
// }
