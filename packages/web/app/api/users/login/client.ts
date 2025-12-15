import { LOGIN_USER_API_URL } from "@/app/(core)/constants";
import { AppError } from "@/app/(core)/error/appError";
import { GetLoginUserResponseScheme } from "./scheme";

export const getLoginUser = async () => {
  // APIを実行する
  const res = await fetch(`${LOGIN_USER_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
  const data = await res.json()

  return GetLoginUserResponseScheme.parse(data)
}
