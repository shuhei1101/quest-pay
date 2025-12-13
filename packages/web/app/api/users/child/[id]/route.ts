import { NextResponse } from "next/server"
import { withAuth } from "@/app/(core)/withAuth"
import { fetchUserInfo } from "@/app/api/users/login/query"
import { ServerError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { GetChildResponse } from "./schema"
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { fetchUserInfoByChildId } from "./query"

/** 子供を取得する */
export async function GET(
  req: Request,
  context: { params: Promise<{ childId: string }> }
) {
  return withAuth(async (supabase, userId) => {
    return withRouteErrorHandling(async () => {
      // パスパラメータからIDを取得する
      const params = await context.params
      const childId = params.childId
      
      devLog("GetChild.パラメータ.ID: ", params.childId)

     // 家族IDを取得する
      const userInfo = await fetchUserInfo({userId, supabase})
      if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
      
      // 子供を取得する
      const data = await fetchUserInfoByChildId({ supabase, childId })
      
      devLog("取得した子供: ", data)

      // 家族IDが一致しない場合
      if (userInfo.family_id !== data?.family_id) return NextResponse.json({})
  
      return NextResponse.json({user: data} as GetChildResponse)
    })
  })
}

// /** 子供を更新する */
// export async function PUT(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   return withAuth(async (supabase, userId) => {
//     try {
//       // パスパラメータからIDを取得する
//       const params = await context.params
//       const childId = params.id

//       // bodyから子供を取得する
//       const body = await req.json()
//       const data = PutChildRequestSchema.parse(body)

//       // 家族IDを取得する
//       const userInfo = await fetchUserInfo({userId, supabase})
//       if (!userInfo?.family_id) throw new ServerError("家族IDの取得に失敗しました。")
        
//       // 子供を更新する
//       await updateChild({
//         tags: data.tags,
//         quest: {
//           icon_id: data.quest.icon_id,
//           type: "family",
//           name: data.quest.name,
//           id: childId,
//           updated_at: data.quest.updated_at,
//           category_id: data.quest.category_id,
//           icon_color: data.quest.icon_color,
//         },
//         supabase,
//         familyQuest: {
//           family_id: userInfo.family_id,
//           is_public: data.family_quest.is_public
//         }
//       })
      
//       return NextResponse.json({})
//     } catch (err) {
//       return handleServerError(err)
//     }
//   })
// }

// /** 子供を削除する */
// export async function DELETE(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   return withAuth(async (supabase) => {
//     try {
//       // パスパラメータからIDを取得する
//       const params = await context.params
//       const childId = params.id

//       // bodyから子供を取得する
//       const body = await req.json()
//       const data = DeleteChildRequestSchema.parse(body)

//       // 子供を削除する
//       await deleteChild({
//         supabase,
//         quest: {
//           id: childId,
//           updated_at: data.quest.updated_at,
//         }
//       })

//       return NextResponse.json({})
//     } catch (err) {
//       return handleServerError(err)
//     }
//   })
// }
