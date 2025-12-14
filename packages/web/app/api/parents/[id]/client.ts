import { CHILD_API_URL, CHILDREN_API_URL, PARENT_API_URL, PARENTS_API_URL } from "@/app/(core)/constants";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import { GetParentResponseSchema } from "./schema";

/** 親をGETする */
export const getParent = async (parentId: string) => {
  // APIを実行する
  const res = await fetch(`${PARENT_API_URL(parentId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) throw AppError.fromResponse(data, res.status)
    
  devLog("getParent.戻り値: ", data)

  return GetParentResponseSchema.parse(data)
}

/** 親をPOSTする */
// export const postChild = async (request: PostChildRequest) => {
//   devLog("postChild.実行APIエンドポイント: ", CHILDREN_API_URL)
//   // APIを実行する
//   const res = await fetch(`${CHILDREN_API_URL}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(request)
//   })

//   // ステータスが不正な場合、アプリ例外を発生させる
//   if (!res.ok) {
//     devLog("postChild.API実行失敗: ", res)
//     const data = await res.json()
//     throw AppError.fromResponse(data, res.status)
//   }
//   const data = await res

//   return PostChildResponseSchema.parse(data)
// }
