import { CHILD_API_URL, CHILDREN_API_URL } from "@/app/(core)/endpoints";
import { GetChildrenResponseScheme, PostChildRequest, PostChildResponseScheme } from "./scheme";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";

/** 子供をGETする */
export const getChildren = async () => {
  devLog("getChildren.API呼び出し: ", {URL: CHILDREN_API_URL})
  // APIを実行する
  const res = await fetch(`${CHILDREN_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }
  devLog("getChildren.戻り値: ", data)

  return GetChildrenResponseScheme.parse(data)
}

/** 子供をPOSTする */
export const postChild = async (request: PostChildRequest) => {
  devLog("postChild.API呼び出し: ", {URL: CHILDREN_API_URL, request})
  // APIを実行する
  const res = await fetch(`${CHILDREN_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    devLog("postChild.API実行失敗: ", res)
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
  const data = await res

  return PostChildResponseScheme.parse(data)
}
