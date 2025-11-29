import { userDao } from "../_data-access/userDao"
import { UserFormSchema } from "../_schema/userSchema"

/** ユーザを更新する */
export const updateUser = async (user: UserFormSchema) => {
  // ユーザを更新する
  await userDao.update({
    name: user.name,
    updated_at: user.updated_at!,
    type_id: user.type!,
    user_id: user.user_id!
  })
}
