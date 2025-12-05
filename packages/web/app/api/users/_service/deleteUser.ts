import { userDao } from "../_data-access/userDao"
import { UserFormSchema } from "../entity"

/** ユーザを削除する */
export const deleteUser = async (user: UserFormSchema) => {
  // ユーザを削除する
  await userDao.delete({
    user_id: user.user_id!,
    updated_at: user.updated_at!
  })
}
