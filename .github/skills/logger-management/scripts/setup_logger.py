#!/usr/bin/env python3
"""
Logger セットアップスクリプト

loglevel ベースの logger を Next.js プロジェクトに導入するスクリプト。
フロントエンドとバックエンド両方で使用可能。
"""

import os
import json

def create_logger_file(base_path: str) -> None:
    """logger.ts ファイルを生成"""
    logger_content = """import log from 'loglevel'

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
"""
    
    logger_path = os.path.join(base_path, 'logger.ts')
    with open(logger_path, 'w', encoding='utf-8') as f:
        f.write(logger_content)
    print(f"✅ Created: {logger_path}")


def update_package_json(base_path: str) -> None:
    """package.json に loglevel を追加"""
    package_json_path = os.path.join(base_path, 'package.json')
    
    if not os.path.exists(package_json_path):
        print(f"❌ package.json not found at {package_json_path}")
        return
    
    with open(package_json_path, 'r', encoding='utf-8') as f:
        package_data = json.load(f)
    
    # dependencies に loglevel を追加
    if 'dependencies' not in package_data:
        package_data['dependencies'] = {}
    
    if 'loglevel' not in package_data['dependencies']:
        package_data['dependencies']['loglevel'] = '^1.9.1'
        
        with open(package_json_path, 'w', encoding='utf-8') as f:
            json.dump(package_data, f, indent=2, ensure_ascii=False)
            f.write('\n')  # 末尾に改行を追加
        
        print(f"✅ Added loglevel to package.json")
        print("   Run 'npm install' to install the package")
    else:
        print("ℹ️  loglevel already in package.json")


def create_env_example(base_path: str) -> None:
    """.env.example に環境変数を追加"""
    env_example_path = os.path.join(base_path, '.env.example')
    env_content = "\n# Logger設定\nNEXT_PUBLIC_LOG_LEVEL=info  # trace | debug | info | warn | error\n"
    
    if os.path.exists(env_example_path):
        with open(env_example_path, 'a', encoding='utf-8') as f:
            f.write(env_content)
        print(f"✅ Updated: {env_example_path}")
    else:
        with open(env_example_path, 'w', encoding='utf-8') as f:
            f.write(env_content.lstrip())
        print(f"✅ Created: {env_example_path}")


def main():
    """メイン実行"""
    # Next.js プロジェクトのベースパス
    base_path = input("Enter the base path for the Next.js project (default: packages/web/app/(core)): ").strip()
    if not base_path:
        base_path = "packages/web/app/(core)"
    
    # packages/web のパスも取得
    web_base = os.path.dirname(os.path.dirname(base_path)) if 'app' in base_path else "packages/web"
    
    print(f"\n🚀 Setting up logger in {base_path}")
    print(f"   Web base: {web_base}\n")
    
    # logger.ts を作成
    create_logger_file(base_path)
    
    # package.json を更新
    update_package_json(web_base)
    
    # .env.example を作成/更新
    create_env_example(web_base)
    
    print("\n✅ Logger setup complete!")
    print("\n📝 Next steps:")
    print("   1. Run 'npm install' in packages/web")
    print("   2. Add NEXT_PUBLIC_LOG_LEVEL to your .env.local")
    print("   3. Import logger: import { logger } from '@/app/(core)/logger'")
    print("   4. Use: logger.info('message'), logger.error('error'), etc.")


if __name__ == "__main__":
    main()
