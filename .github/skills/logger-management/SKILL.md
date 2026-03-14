---
name: logger-management
description: 'Logger 導入・管理の知識を提供するスキル。loglevelを使用したフロント・バック両対応のログシステム構築、debug/info/error等のレベル分けを担当。'
---

# Logger Management

TypeScript プロジェクトでのログ管理を効率化するスキル。loglevel ライブラリを使用して、フロントエンドとバックエンド両方で統一的なログ管理を実現する。

## 使用タイミング

以下の場合にこのスキルを使用する：

- プロジェクトに logger を導入したい
- フロントエンドとバックエンド両方でログを管理したい
- debug, info, warn, error などのログレベルを分けたい
- 環境変数でログレベルを制御したい
- logger の使い方やベストプラクティスを確認したい
- 他の logger ライブラリとの比較情報が必要
- **既存コードに適切なログを配置したい**
- **既存コードのログ配置をレビュー・改善したい**

## Logger セットアップ手順

### 1. セットアップスクリプトの実行

`scripts/setup_logger.py` を使用して logger をプロジェクトに導入する：

```bash
python3 .github/skills/logger-management/scripts/setup_logger.py
```

スクリプトは以下を実行する：
- `app/(core)/logger.ts` の作成（logger実装）
- `package.json` への loglevel 追加
- `.env.example` への環境変数追加

### 2. パッケージのインストール

```bash
cd packages/web
npm install
```

### 3. 環境変数の設定

`.env.local` に以下を追加：

```bash
NEXT_PUBLIC_LOG_LEVEL=debug  # 開発環境
# NEXT_PUBLIC_LOG_LEVEL=info   # 本番環境
```

### 4. Logger の使用開始

```typescript
import { logger } from '@/app/(core)/logger'

logger.info('情報ログ')
logger.debug('デバッグログ')
logger.warn('警告ログ')
logger.error('エラーログ')
```

## ログ配置分析（デバッグ改善）

### 既存コードの分析

`scripts/analyze_logs.py` を使用して、既存コードのログ配置を分析する：

```bash
python3 .github/skills/logger-management/scripts/analyze_logs.py <ファイルパス>
```

**分析内容:**
- API エントリーポイントのログ有無
- try-catch ブロックのエラーログ有無
- DB操作のログ有無
- async 関数のログ有無
- useEffect のログ有無（フロントエンド）

**出力例:**
```
🔴 重要度 HIGH: 3 件
🟡 重要度 MEDIUM: 5 件
🔵 重要度 LOW: 2 件
```

### ログ配置ガイド

デバッグに効果的なログ配置のベストプラクティスは `references/log_placement_guide.md` を参照：

- API Route / Server Actions のログパターン
- データベース操作のログパターン
- フロントエンド（コンポーネント）のログパターン
- 条件分岐のログパターン
- 非同期処理のログパターン
- 避けるべきパターン（ループ内の過度なログ等）
- ログレベル使い分けガイドライン

**ワークフロー:**
1. `analyze_logs.py` でファイルを分析
2. 重要度HIGHの項目から対応
3. `log_placement_guide.md` のパターンを参照
4. ログを追加・改善
5. 再度分析して確認

## 詳細情報の参照

### リファレンスドキュメント

詳細な使用方法やベストプラクティスは以下を参照：

- **`references/logger_usage.md`** - 詳細な使用方法、各ログレベルの使い分け、フロント・バックでの使用例、ベストプラクティス
- **`references/logger_comparison.md`** - TypeScript logger ライブラリの比較（loglevel, pino, winston, debug, console）、選択理由
- **`references/log_placement_guide.md`** - デバッグに効果的なログ配置のベストプラクティス、パターン別のガイド、避けるべきパターン

必要に応じて grep_search または read_file で参照する。

### Logger ライブラリ選択

このプロジェクトでは **loglevel** を採用：

- ✅ フロント + バック両対応
- ✅ シンプルで軽量
- ✅ debug, info, warn, error レベル完全サポート
- ✅ 環境変数で簡単にレベル変更

他のライブラリ（pino, winston等）との詳細比較は `references/logger_comparison.md` を参照。

## 実装パターン

### フロントエンド（コンポーネント）

```typescript
'use client'
import { logger } from '@/app/(core)/logger'

export default function MyComponent() {
  const handleClick = () => {
    try {
      logger.info('ボタンクリック')
      // 処理
    } catch (error) {
      logger.error('エラー発生', error)
    }
  }
  
  return <button onClick={handleClick}>送信</button>
}
```

### バックエンド（API Route）

```typescript
import { logger } from '@/app/(core)/logger'

export async function GET(request: NextRequest) {
  logger.info('API リクエスト', { path: request.nextUrl.pathname })
  
  try {
    const data = await fetchData()
    logger.debug('データ取得成功', { count: data.length })
    return Response.json(data)
  } catch (error) {
    logger.error('データ取得エラー', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

### Server Actions

```typescript
'use server'
import { logger } from '@/app/(core)/logger'

export async function createQuest(formData: FormData) {
  logger.info('クエスト作成開始')
  
  try {
    const result = await db.insert(quests).values({ /* ... */ })
    logger.info('クエスト作成成功', { questId: result.id })
    return { success: true }
  } catch (error) {
    logger.error('クエスト作成失敗', error)
    return { success: false }
  }
}
```

## ログレベルの使い分け

| レベル | 用途 |
|--------|------|
| **trace** | 最も詳細なデバッグ情報（関数の入出力等） |
| **debug** | デバッグ情報（開発時のみ必要） |
| **info** | 一般的な情報（処理の開始・完了等） |
| **warn** | 警告（問題になりうる状況） |
| **error** | エラー（処理失敗、例外） |

環境変数 `NEXT_PUBLIC_LOG_LEVEL` で設定したレベル以上のログのみが出力される：
- `debug` → debug, info, warn, error を出力（開発環境）
- `info` → info, warn, error を出力（ステージング環境）
- `warn` → warn, error を出力（本番環境推奨）
- `error` → error のみ出力（本番環境・最小ログ）

## ベストプラクティス

### 1. 適切なログレベルと環境設定
- error は error、debug は debug として記録
- 開発環境: `debug` 以上
- ステージング環境: `info` 以上
- 本番環境: `warn` または `error` のみ（パフォーマンス重視）
- **⚠️ フロントエンド特有の注意**: フロントエンドでは **info 以上のログがブラウザコンソールに表示され、エンドユーザーに見られる**
  - 本番フロントエンド: `NEXT_PUBLIC_LOG_LEVEL=warn` 推奨
  - 機密情報、内部実装の詳細は debug レベルで（本番では非表示）
  - バックエンド（API）のログはサーバー内なので info 以上でも問題なし

### 2. コンテクスト独立なメッセージ
ログを読むだけで意味がわかるメッセージを作成：
```typescript
// ❌ 悪い例
logger.error('エラー')

// ✅ 良い例
logger.error('クエスト取得エラー', { questId, familyId, error })
```

### 3. 構造化ロギング（JSON形式）
検索・フィルタリングしやすいJSON形式でログ出力：
```typescript
logger.info('クエスト作成', {
  questId,
  userId,
  timestamp: new Date().toISOString(),
})
```

### 4. 機密情報の除外（重要）
**絶対に記録してはいけない情報:**
- パスワード、API キー、アクセストークン
- クレジットカード番号、CVV
- データベース接続文字列
- 暗号化キー、シークレット
- セッションID（ハッシュ化を検討）
- PII（個人を特定できる情報）- プライバシーポリシー要確認

### 5. 記録すべきイベント
必ず記録すべきイベント：
- 認証イベント（成功・失敗）
- 承認の失敗（権限エラー）
- 重要なデータ変更（作成・更新・削除）
- アプリケーションエラー
- セキュリティイベント
- リスクの高いイベント（データエクスポート等）

### 6. ログの用途を理解
ログはトラブルシューティングだけでなく：
- **監査（Audit）** - 誰が・いつ・何を・変更したか
- **プロファイリング** - パフォーマンス計測
- **統計・アラート** - エラー率、異常検知
- **ユーザー行動分析** - 機能使用状況
- **セキュリティ監視** - 不正アクセス検出

### 7. 適切なログ量を維持
- ループ内の過度なログは避ける
- 200/300 HTTPステータスコード（正常系）はログしない（または debug）
- 400/500 HTTPステータスコード（エラー系）のみログ
- 本番環境では warn/error のみ

### 8. 誰がログを読むかを考える
- **エンドユーザー**: error のみ、フレンドリーなメッセージ
- **運用エンジニア**: info/warn/error、トラブルシューティング情報
- **開発者**: すべてのレベル、詳細なデバッグ情報

詳細は `references/logger_usage.md` と `references/log_placement_guide.md` を参照。
