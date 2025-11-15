import { RawUser } from "@/app/(user)/_schema/userSchema";
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase";

/** プロジェクトIDに紐づくプロジェクトメンバーIDを取得する */
export const fetchProjectMemberIds = async (project_id: number) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("project_members")
      .select('user_id')
      .eq("project_id", project_id);

    // エラーをチェックする
    if (error) throw error;

    return data as {user_id: string}[] ?? []
}


/** プロジェクトIDに紐づくプロジェクトメンバーを取得する */
export const fetchProjectMembers = async (project_id: number) => {
  // データを取得する
  const { data, error } = await clientSupabase.from("project_members")
      .select(`users (*)`)
      .eq("project_id", project_id);

    // エラーをチェックする
    if (error) throw error;

    const members = data?.flatMap(e => e.users) as RawUser[] ?? []

    return members
}
