import queryString from "query-string"
import { ICONS_API_URL } from "@/app/(core)/constants";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import { GetIconsResponseSchema } from "./schema";

/** 家族クエストをGETする */
export const getIcons = async () => {
  // APIを実行する
  const res = await fetch(`${ICONS_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getIconsの戻り値: ", data)

  return GetIconsResponseSchema.parse(data)
}
