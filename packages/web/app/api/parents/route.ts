import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/app/(core)/withAuth"
import { fetchUserInfo } from "../users/login/query"
import { ServerError } from "@/app/(core)/error/appError"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchParentsByFamilyId } from "./query"
import { GetParentsResponse } from "./schema"


/** 家族の子供を取得する */
export async function GET(
  req: NextRequest,
) {
  return withAuth(async (supabase, userId) => {
    return withRouteErrorHandling(async () => {
      // 家族IDを取得する
      const userInfo = await fetchUserInfo({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
  
      // 子供を取得する
      const result = await fetchParentsByFamilyId({supabase, familyId: userInfo.family_id })
  
      return NextResponse.json({parents: result} as GetParentsResponse)
    })
  })
}

/** 子供を登録する */
// export async function POST(
//   request: NextRequest,
// ) {
//   return withAuth(async (supabase, userId) => {
//     return withRouteErrorHandling(async () => {
//       // bodyから子供を取得する
//       const body = await request.json()
//       const data  = PostParentinsertParentRequestSchema.parse(body)

//      // 家族IDを取得する
//       const userInfo = await fetchUserInfo({userId, supabase})
//       if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
        
//       // 招待コードを生成する
//       const inviteCode = await generateUniqueInviteCode({supabase})
        
//       // 子供を登録する
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
