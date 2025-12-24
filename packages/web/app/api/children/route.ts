import { NextRequest, NextResponse } from "next/server"
import { getAuthContext,  } from "@/app/(core)/_auth/withAuth"
import { GetChildrenResponse, PostChildRequestScheme, PostChildResponse } from "./scheme"
import { registerChild } from "./service"
import { generateUniqueInviteCode } from "./invite/service"
import { fetchUserInfoByUserId } from "../users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchChildrenByFamilyId } from "./query"


/** 家族の子供を取得する */
export async function GET(
  req: NextRequest,
) {
  return withRouteErrorHandling(async () => {
    // 認証コンテキストを取得する
    const { supabase, userId } = await getAuthContext()
      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
  
      // 子供を取得する
      const result = await fetchChildrenByFamilyId({supabase, familyId: userInfo.family_id })
  
      return NextResponse.json({children: result} as GetChildrenResponse)
    })
}

/** 子供を登録する */
export async function POST(
  request: NextRequest,
) {
  // 認証コンテキストを取得する
  return withRouteErrorHandling(async () => {
      const { supabase, userId } = await getAuthContext()
      // bodyから子供を取得する
      const body = await request.json()
      const data  = PostChildRequestScheme.parse(body)

     // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
        
      // 招待コードを生成する
      const inviteCode = await generateUniqueInviteCode({supabase})
        
      // 子供を登録する
      const childId = await registerChild({
        child: {
          inviteCode: inviteCode
        },
        profile: {
          name: data.form.name,
          iconColor: data.form.iconColor,
          iconId: data.form.iconId,
          familyId: userInfo.family_id
        }
      })
      return NextResponse.json({childId} as PostChildResponse)
    })
}
