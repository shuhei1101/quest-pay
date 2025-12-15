import { SupabaseClient } from "@supabase/supabase-js"
import { ServerError } from "@/app/(core)/error/appError"
import { generateInviteCode } from "@/app/(core)/util"
import { fetchChildByInviteCode } from "../query"

/** 使用可能な家族招待コードを生成する */
export const generateUniqueInviteCode = async ({supabase}: {
  supabase: SupabaseClient,
}) => {
  for (let i = 0; i < 10; i++) {
    // 招待コードを生成する
    const code = generateInviteCode()

    const child = await fetchChildByInviteCode({invite_code: code, supabase})

    // 招待コードが存在していない場合
    if (child === null) {
      // コードを返却する
      return code
    }
  }
  throw new ServerError("招待コードの生成に失敗しました")
}
