---
name: family-view
description: 家族閲覧画面の構造知識を提供するスキル。表示内容、メンバー管理を含む。
---

# 家族プロフィール閲覧 スキル

## 概要

このスキルは、家族のプロフィール閲覧画面の知識を提供します。家族詳細、フォロー機能、タイムライン表示を含みます。

## メインソースファイル

### 画面コンポーネント
- `app/(app)/families/[id]/view/page.tsx`: ルートページ（authGuard + リダイレクト）
- `app/(app)/families/[id]/view/FamilyProfileViewScreen.tsx`: プロフィール画面（ビジネスロジック）
- `app/(app)/families/[id]/view/_components/FamilyProfileViewLayout.tsx`: レイアウト（プレゼンテーション）
- `app/(app)/families/[id]/view/_components/FamilyProfileViewFooter.tsx`: フッター

### フック
- `app/(app)/families/[id]/view/_hooks/useFamilyProfile.ts`: 家族プロフィール関連フック群
  - `useFamilyDetail`: 家族詳細取得
  - `useFollowStatus`: フォロー状態取得
  - `useFollowToggle`: フォロー切り替え
  - `useFamilyTimeline`: タイムライン取得

### API Routes
- `GET /api/families/[id]/profile`: 家族詳細取得
- `GET /api/families/[id]/follow/status`: フォロー状態取得
- `POST /api/families/[id]/follow`: フォロー
- `DELETE /api/families/[id]/follow`: フォロー解除
- `GET /api/families/[id]/timeline`: タイムライン取得

## 主要機能グループ

### 1. プロフィール表示
- 家族名（オンライン名 or ローカル名）
- 表示ID（`@displayId`）
- 家族アイコン
- 自己紹介文

### 2. 統計情報
- フォロワー数
- フォロー数
- 公開クエスト数
- いいね数

### 3. フォロー機能
- フォロー/フォロー解除ボタン（他家族の場合のみ）
- フォロー状態の表示

### 4. タイムライン
- 家族のタイムラインメッセージ表示
- 相対時刻表示

## Reference Files Usage

### コンポーネント構造を把握する場合
画面構成、コンポーネント階層、フック構成を確認：
```
references/component_structure.md
```

### データ表示パターンを理解する場合
フック、データソース、整形処理、デフォルト値を確認：
```
references/data_display.md
```

### 画面フローを把握する場合
表示フロー、フォロー切り替え、認証、条件付きレンダリングを確認：
```
references/flow_diagram.md
```

### アクション実装を確認する場合
フォローボタン、統計表示、タイムライン、通知の実装を確認：
```
references/action_components.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でコンポーネント構成確認
2. **データ構造の理解**: `references/data_display.md`で表示データ確認
3. **実装時**: `references/flow_diagram.md`で画面フロー確認
4. **アクション実装時**: `references/action_components.md`で具体的な実装確認

## 実装上の注意点

### 必須パターン
- **Screen + Layout**: ビジネスロジックとプレゼンテーションの分離
- **複数フック並列実行**: useFamilyDetail、useFollowStatus、useFamilyTimelineを並列取得
- **authGuard**: 親のみアクセス可能（子供・ゲストは不可）
- **自家族判定**: `userInfo.profiles.familyId === id` で判定

### 権限管理
- **親のみ**: 画面アクセス可能
- **子供・ゲスト**: ホーム画面へリダイレクト

### フォローボタンの表示制御
- **自家族**: フォローボタン非表示
- **他家族**: フォローボタン表示
- **フォロー中**: 「フォロー解除」ボタン
- **未フォロー**: 「フォローする」ボタン

### データ整形
- **家族名**: オンライン名優先、なければローカル名
- **タイムライン時刻**: `formatTime()` で相対時刻に変換
- **統計情報**: デフォルト値は `0`

**Examples from other skills:**
- Product management: `communication.md`, `context_building.md` - detailed workflow guides
- BigQuery: API reference documentation and query examples
- Finance: Schema documentation, company policies

**Appropriate for:** In-depth documentation, API references, database schemas, comprehensive guides, or any detailed information that Claude should reference while working.

### assets/
Files not intended to be loaded into context, but rather used within the output Claude produces.

**Examples from other skills:**
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


