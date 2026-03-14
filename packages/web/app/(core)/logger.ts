import log from 'loglevel'

// ログレベルの設定
const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info'

// ログレベルを設定
log.setLevel(LOG_LEVEL as log.LogLevelDesc)

// カスタムログフォーマッター（オプション）
const originalFactory = log.methodFactory
log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName)
  
  return function (...args) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${methodName.toUpperCase()}]`
    rawMethod(prefix, ...args)
  }
}

// 設定を適用
log.setLevel(log.getLevel())

// デフォルトエクスポート
export default log

// 名前付きエクスポート（便利なエイリアス）
export const logger = {
  debug: log.debug.bind(log),
  info: log.info.bind(log),
  warn: log.warn.bind(log),
  error: log.error.bind(log),
  trace: log.trace.bind(log),
}

// 型定義エクスポート
export type Logger = typeof logger
