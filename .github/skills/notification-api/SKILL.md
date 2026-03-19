---
name: notification-api
description: 通知API操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。 Trigger Keywords: notification API, notification CRUD, notification operations
---

# 通知API スキル

## 概要

このスキルは、アプリ内通知の取得、既読管理を行うAPI群の知識を提供します。クエスト更新、承認依頼、コメントなどのイベントに基づいて通知が作成され、ユーザーに配信されます。

## メインソースファイル

### API Routes
- `packages/web/app/api/notifications/route.ts`: 通知一覧取得
- `packages/web/app/api/notifications/read/route.ts`: 既読マーク（複数）

### クライアント側
- `packages/web/app/api/notifications/client.ts`: APIクライアント関数
- `packages/web/app/api/notifications/read/client.ts`: 既読マーク用クライアント

### データベース
- `packages/web/app/api/notifications/query.ts`: データベースクエリ（fetchNotifications, fetchNotification）
- `packages/web/app/api/notifications/db.ts`: 低レベルDB操作（updateNotification）
- `packages/web/app/api/notifications/service.ts`: ビジネスロジック（readNotifications）
- `drizzle/schema.ts`: notifications テーブル定義

## 主要機能グループ

### 1. 通知取得
- ログインユーザーの通知一覧を取得
- 作成日時の降順でソート
- プロフィールIDによる自動フィルタリング

### 2. 既読管理
- 複数通知の一括既読マーク
- 楽観的ロック（`updatedAt`）による排他制御
- トランザクションによる一貫性保証

### 3. 通知タイプ
- `family_quest_review`: 家族クエスト承認依頼（親向け）
- `quest_report_approved`: クエスト報告承認（子供向け）
- `quest_report_rejected`: クエスト報告却下（子供向け）
- `quest_cleared`: クエストクリア
- `quest_level_up`: レベルアップ
- `quest_completed`: クエスト完了
- `other`: その他汎用通知

## Reference Files Usage

### データベース構造を把握する場合
通知関連テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### 通知ライフサイクルを理解する場合
作成から既読までのフロー、ステータス遷移を確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、権限チェックを確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、バリデーションルールを確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でライフサイクル確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQuery/useMutationでAPIアクセス（将来実装）
- **トランザクション**: 複数通知更新時は必須
- **権限チェック**: 必ず自分の通知かを確認
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **通知一覧取得**: ログインユーザーの通知のみ取得
- **既読マーク**: 自分の通知のみ既読可能（他人の通知へのアクセスは拒否）

### エラーハンドリング
- **認証エラー**: 401 Unauthorized
- **権限エラー**: 500 Internal Server Error（他人の通知へのアクセス時）
- **バリデーションエラー**: 400 Bad Request（Zodスキーマ検証失敗）
- **DBエラー**: 500 Internal Server Error（DatabaseError）

### 楽観的ロック
- `updatedAt` フィールドで楽観的ロックを実装
- 更新時に `WHERE updated_at = :updatedAt` 条件を追加
- 更新件数が0の場合はエラー

### 将来実装予定
- **通知削除**: `DELETE /api/notifications/[id]`
- **未読数取得**: `GET /api/notifications/unread-count`
- **全件既読**: `PUT /api/notifications/read-all`
- **プッシュ通知**: Firebase Cloud Messaging連携
- **通知の自動削除**: 古い既読通知のアーカイブ
- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


