/** 例外メッセージ */
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR'

/** アプリケーション固有の例外 */
export const APP_ERROR = 'AppError'
export class AppError extends Error {
  public type = APP_ERROR
  constructor(
    public code: string,
    public status: number,
    message: string
  ) {
    super(message);
  }
}

/** データベース例外 */
export const DATABASE_ERROR_CODE = 'DB_ERROR'
export class DatabaseError extends AppError {
  constructor(message = 'データベース例外が発生しました。') {
    super(DATABASE_ERROR_CODE, 500, message);
  }
}

/** 一意制約例外 */
export const DUPLICATE_ERROR_CODE = 'DUPLICATE_ERROR'
export class DuplicateError extends AppError {
  constructor(message = '一意制約違反です。') {
    super('DUPLICATE_ERROR', 409, message);
  }
}

/** 削除時の排他制御例外 */
export const DELETED_CONFLICT_ERROR_CODE = 'DELETED_CONFLICT_ERROR'
export class DeletedConflictError extends AppError {
  constructor(message = '該当のデータは存在しません。') {
    super('DELETED_CONFLICT_ERROR', 409, message);
  }
}

/** 排他制御例外（最終更新日時orバージョン） */
export const VERSION_CONFLICT_ERROR_CODE = 'VERSION_CONFLICT_ERROR'
export class VersionConflictError extends AppError {
  constructor(message = '他のユーザによって更新されました。') {
    super('VERSION_CONFLICT_ERROR', 409, message);
  }
}

/** 認証エラー（JWTトークンや認可エラーなど） */
export const AUTHORIZED_ERROR_CODE = 'AUTHORIZED_ERROR'
export class AuthorizedError extends AppError {
  constructor(message = '権限エラーが発生しました。') {
    super('AUTHORIZED_ERROR', 401, message);
  }
}
