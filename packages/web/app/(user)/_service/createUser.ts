import { userDao } from "../_data-access/userDao"
import { UserFormSchema } from "../_schema/userSchema"

/** ユーザを作成する */
export const createUser = async (user: UserFormSchema) => {
  // ユーザを挿入する
  const id = await userDao.insert({
    name: user.name,
    user_id: user.user_id!
  })
  return id
}
