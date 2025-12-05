import { handleAPIError } from "@/app/(core)/errorHandler";
import { USER_LOGIN_API_URL } from "@/app/(core)/constants";
import { UsersLoginGetResponseSchema } from "./schema";

export const usersLoginGet = async () => {
  // APIを実行する
  const res = await fetch(`${USER_LOGIN_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }
  const data = await res.json()

  return UsersLoginGetResponseSchema.parse(data)
}
