import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/app/(core)/withAuth"
import { fetchUserInfoByUserId } from "../../users/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { GetParentResponse } from "./scheme"
import { fetchParent } from "../query"


/** 家族の親を取得する */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRouteErrorHandling(async () => {
    return withAuth(async (supabase, userId) => {
      // パスパラメータからIDを取得する
      const params = await context.params
      const parentId = params.id

      // 家族IDを取得する
      const userInfo = await fetchUserInfoByUserId({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
  
      // 親を取得する
      const data = await fetchParent({supabase, parentId })

      // 親が存在しない場合
      if (!data) throw new ServerError("親情報の取得に失敗しました。")

      // 家族IDが一致しない場合
      if (userInfo.family_id !== data.family_id) throw new ServerError("同じ家族に所属していないデータにアクセスしました。")
  
      return NextResponse.json({parent: data} as GetParentResponse)
    })
  })
}

/** 親を登録する */
// export async function POST(
//   request: NextRequest,
// ) {
  //     return withRouteErrorHandling(async () => {
//   return withAuth(async (supabase, userId) => {
//       // bodyから親を取得する
//       const body = await request.json()
//       const data  = PostParentinsertParentRequestScheme.parse(body)

//      // 家族IDを取得する
//       const userInfo = await fetchUserInfo({userId, supabase})
//       if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
        
//       // 招待コードを生成する
//       const inviteCode = await generateUniqueInviteCode({supabase})
        
//       // 親を登録する
//       const childId = await insertParent({
//         profile: {
//           name: data.child.name,
//           icon_id: data.child.icon_id,
//           icon_color: data.child.icon_color,
//           birthday: data.child.birthday
//         },
//         child: {
//           invite_code: inviteCode
//         },
//         supabase: supabase,
//         familyId: userInfo.family_id
//       })
//       return NextResponse.json({childId} as PostParentinsertParentResponse)
//     })
//   })
// }
