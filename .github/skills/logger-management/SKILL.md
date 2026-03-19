---
name: logger-management
description: 'Logger 導入・管理の知識を提供するスキル。loglevelを使用したフロント・バック両対応のログシステム構築、debug/info/error等のレベル分けを担当。 Trigger Keywords: ロガー、loglevel、ログ記録、デバッグログ、ログ管理、ログ設定
---

# Logger Management スキル

## 概要

このスキルは、loglevelライブラリを使用したフロント・バック両対応のログシステム導入・管理の知識を提供します。環境変数でログレベルを制御し、デバッグを効率化します。

## メインソースファイル

### Logger 実装
- `packages/web/app/(core)/logger.ts`: Logger実体、ログレベル設定

### 環境変数
- `.env.local`: ログレベル設定（NEXT_PUBLIC_LOG_LEVEL）
- `.env.example`: 環境変数テンプレート

### スクリプト
- `scripts/setup_logger.py`: Logger自動セットアップスクリプト
- `scripts/analyze_logs.py`: 既存コードのログ配置分析スクリプト

## 主要機能グループ

### 1. セットアップ
- loglevelパッケージのインストール
- logger.tsの作成
- 環境変数の設定

### 2. ログレベル管理
- debug: 開発時のデバッグ情報
- info: 通常の処理フロー
- warn: 警告（処理は継続）
- error: エラー（処理失敗）

### 3. ログ配置分析
- 既存コードのログ配置チェック
- 重要度別の改善ポイント提示
- ベストプラクティスの適用

## Reference Files Usage

### Logger導入手順を確認する場合
自動セットアップスクリプトの使い方、手動セットアップ手順、環境別設定を確認：
```
references/setup_guide.md
```

### ログの使用パターンを理解する場合
API Route、DB操作、フロントエンド、React Query等のパターン別使用例を確認：
```
references/usage_patterns.md
```

### ログレベルの使い分けを学ぶ場合
各レベルの詳細、環境別設定、選択基準を確認：
```
references/log_levels.md
```

## クイックスタート

1. **セットアップ**: `references/setup_guide.md`でLogger導入
2. **使用方法の習得**: `references/usage_patterns.md`でパターン確認
3. **レベル理解**: `references/log_levels.md`で使い分け確認
4. **既存コード改善**: `scripts/analyze_logs.py`で分析 → パターン適用

## 実装上の注意点

### 必須パターン
- **環境変数制御**: NEXT_PUBLIC_LOG_LEVELで環境別にレベル変更
- **例外ハンドリング**: すべてのtry-catchでlogger.error
- **エントリーポイント**: API RouteやServer Actionsの開始・終了をログ
- **スクリプト活用**: analyze_logs.pyで既存コードを分析

### ログレベルの選択
- **debug**: 開発時のみ（本番では非表示）
- **info**: 重要な操作の記録
- **warn**: 異常だが継続可能
- **error**: 処理失敗・例外発生

### 避けるべきパターン
- ループ内での過度なログ
- 機密情報（パスワード等）のログ
- エラーを握りつぶす（ログなしcatch）

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## Logger ライブラリ選択

このプロジェクトでは **loglevel** を採用：

- ✅ フロント + バック両対応
- ✅ シンプルで軽量
- ✅ debug, info, warn, error レベル完全サポート
- ✅ 環境変数で簡単にレベル変更

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
