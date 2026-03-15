(2026年3月15日 14:30記載)

# Logger セットアップガイド

## 概要

loglevel ライブラリを使用したフロント・バック両対応のログシステムの導入手順を説明します。

## セットアップスクリプトの実行

### 自動セットアップ

`setup_logger.py` を使用して logger をプロジェクトに自動導入：

```bash
python3 .github/skills/logger-management/scripts/setup_logger.py
```

**スクリプトが実行する内容：**
1. `app/(core)/logger.ts` の作成（logger実装）
2. `package.json` への loglevel 追加
3. `.env.example` への環境変数追加

### 手動セットアップ

スクリプトを使用しない場合の手動手順：

#### 1. パッケージのインストール

```bash
cd packages/web
npm install loglevel
```

#### 2. Logger実装の作成

`app/(core)/logger.ts` を作成：

```typescript
import log from 'loglevel'

const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info'

log.setLevel(LOG_LEVEL as log.LogLevelDesc)

export const logger = log
```

#### 3. 環境変数の設定

`.env.local` に以下を追加：

```bash
# ログレベル設定
# 開発環境: debug, 本番環境: info または warn
NEXT_PUBLIC_LOG_LEVEL=debug
```

`.env.example` にも同様の設定を追加して、チームメンバーに共有。

## 環境別の設定

### 開発環境

```bash
NEXT_PUBLIC_LOG_LEVEL=debug
```

すべてのログレベル（debug, info, warn, error）が出力されます。

### ステージング環境

```bash
NEXT_PUBLIC_LOG_LEVEL=info
```

info 以上のログ（info, warn, error）が出力されます。

### 本番環境

```bash
NEXT_PUBLIC_LOG_LEVEL=warn
```

warn と error のみが出力されます。

## 動作確認

### テストコード

```typescript
import { logger } from '@/app/(core)/logger'

logger.debug('デバッグログ - 開発環境のみ表示')
logger.info('情報ログ')
logger.warn('警告ログ')
logger.error('エラーログ')
```

### 確認方法

1. ブラウザの開発者ツールを開く
2. Console タブを確認
3. 設定したログレベルに応じてログが表示されることを確認

## トラブルシューティング

### ログが表示されない

**原因：**
- 環境変数が正しく設定されていない
- ログレベルが高すぎる（例：error に設定していて info を出力しようとしている）

**解決方法：**
1. `.env.local` を確認
2. 開発サーバーを再起動
3. ブラウザのキャッシュをクリア

### TypeScript エラーが出る

**原因：**
- loglevel の型定義が正しくインポートされていない

**解決方法：**
```bash
npm install --save-dev @types/loglevel
```

## 次のステップ

- **使用方法の習得**: `references/usage_patterns.md` を参照
- **ログレベルの理解**: `references/log_levels.md` を参照
- **ログ配置の改善**: `scripts/analyze_logs.py` で既存コードを分析
