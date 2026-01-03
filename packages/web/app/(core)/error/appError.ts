import { z } from "zod"

/** 例外メッセージ */
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR'

export const ErrorResponseScheme = z.object({
  code: z.string(),
  message: z.string(),
  path: z.string().optional(),
})
export type ErrorResponse = z.infer<typeof ErrorResponseScheme>

/** アプリケーション固有の例外 */
export const APP_ERROR = 'AppError'
export class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
    public path = '',
  ) {
    super(message)
  }

  public toResponse(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
    }
  }

  static fromResponse(data: any, status: number): AppError{
    // 引数を解析する
    const res = ErrorResponseScheme.parse(data)
    return new AppError(res.code, status, res.message, res.path)
  }
}

/** クライアントエラー */
export const CLIENT_VALUE_ERROR_CODE = 'CLIENT_ERROR'
export class ClientValueError extends AppError {
  constructor(message = '不正な値が入力されました。', path = '') {
    super(CLIENT_VALUE_ERROR_CODE, 0, message, path)
  }
}

/** クライアント認証エラー */
export const CLIENT_AUTH_ERROR_CODE = 'CLIENT_AUTH_ERROR'
export class ClientAuthError extends AppError {
  constructor(message = 'ログイン状態が無効です。', path = '') {
    super(CLIENT_AUTH_ERROR_CODE, 0, message, path)
  }
}

/** サーバ内失敗 */
export const SERVER_ERROR_CODE = 'AUTH_ERROR'
export class ServerError extends AppError {
  constructor(message = 'サーバ内例外が発生しました。', path = '') {
    super(SERVER_ERROR_CODE, 500, message, path)
  }
}

/** データ取得例外 */
export const QUERY_ERROR_CODE = 'DB_ERROR'
export class QueryError extends AppError {
  constructor(message = 'データの読み込みに失敗しました。', path = '') {
    super(QUERY_ERROR_CODE, 500, message, path)
  }
}

/** データベース例外 */
export const DATABASE_ERROR_CODE = 'DB_ERROR'
export class DatabaseError extends AppError {
  constructor(message = 'データベース例外が発生しました。', path = '') {
    super(DATABASE_ERROR_CODE, 500, message, path)
  }
}

/** 一意制約例外 */
export const DUPLICATE_ERROR_CODE = 'DUPLICATE_ERROR'
export class DuplicateError extends AppError {
  constructor(message = '一意制約違反です。', path = '') {
    super('DUPLICATE_ERROR', 409, message, path)
  }
}

/** 削除時の排他制御例外 */
export const DELETED_CONFLICT_ERROR_CODE = 'DELETED_CONFLICT_ERROR'
export class DeletedConflictError extends AppError {
  constructor(message = '該当のデータは存在しません。', path = '') {
    super('DELETED_CONFLICT_ERROR', 409, message, path)
  }
}

/** 排他制御例外（最終更新日時orバージョン） */
export const VERSION_CONFLICT_ERROR_CODE = 'VERSION_CONFLICT_ERROR'
export class VersionConflictError extends AppError {
  constructor(message = '他のユーザによって更新されました。', path = '') {
    super('VERSION_CONFLICT_ERROR', 409, message, path)
  }
}

/** 認証エラー（JWTトークンや認可エラーなど） */
export const AUTHORIZED_ERROR_CODE = 'AUTHORIZED_ERROR'
export class AuthorizedError extends AppError {
  constructor(message = '権限エラーが発生しました。', path = '') {
    super('AUTHORIZED_ERROR', 401, message, path)
  }
}
