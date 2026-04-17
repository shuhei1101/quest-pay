
# ロガー管理 スキル

## 概要

`loglevel` ライブラリを使ったロギング管理。全画面・全APIでロガーを使用する。

## メインファイル

```
packages/web/app/(core)/logger.ts
```

## 使用方法

```typescript
import { logger } from "@/app/(core)/logger"

// ログレベルの使い分け
logger.debug("デバッグ情報", { data })        // 開発時のデバッグ情報
logger.info("処理が完了しました", { userId })  // 通常の情報ログ
logger.warn("警告: リトライします", { error }) // 警告（エラーではないが注意が必要）
logger.error("エラーが発生しました", error)     // エラーログ
```

## ログレベル設定

```bash
# .env.local
NEXT_PUBLIC_LOG_LEVEL=debug   # ローカル開発（全ログ表示）

# 本番環境推奨
NEXT_PUBLIC_LOG_LEVEL=warn    # warn 以上のみ表示
```

ログレベル優先度: `debug < info < warn < error`

## ログ分析スクリプト

```bash
# ログ分析スクリプト（.github/skills/logger-management/scripts/ 配下）
bash .github/skills/logger-management/scripts/analyze_logs.sh
```

## 実装上の注意点

- 全ての Screen・API route でロガーを使用する
- `console.log` は使わない（ロガー経由で統一）
- 機密情報（パスワード・トークン）はログに含めない
- エラーオブジェクトは第2引数で渡す（`logger.error("msg", error)`）
- 本番では `warn` 以上のみ出力して情報漏洩を防ぐ
