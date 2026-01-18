import { createClient } from "../_supabase/server"

/** ユーザがログイン済みかチェックする（エラーを投げない） */
export const checkIsLoggedIn = async () => {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user?.id) {
      return false
    }
    
    return true
  } catch (error) {
    return false
  }
}
