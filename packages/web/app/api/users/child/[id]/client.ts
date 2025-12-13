import { USERS_CHILD_URL } from "@/app/(core)/constants";
import { devLog } from "@/app/(core)/util";
import { GetChildResponseSchema } from "./schema";
import { AppError } from "@/app/(core)/error/appError";


/** 子供を取得する */
export const getChild = async (childId: string) => {
  devLog("getChild.実行API: ", `${USERS_CHILD_URL(childId)}`)
  // APIを実行する
  const res = await fetch(`${USERS_CHILD_URL(childId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getChild.取得データ: ", `${USERS_CHILD_URL(childId)}`)

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
