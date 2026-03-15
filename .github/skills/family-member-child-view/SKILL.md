---
name: family-member-child-view
description: 家族メンバー子供閲覧画面の構造知識を提供するスキル。ファイル構成、表示内容、招待コード機能を含む。
---

# 家族メンバー子供閲覧 スキル

## 概要

このスキルは、家族編集の文脈で子供情報を表示する画面の知識を提供します。招待コード表示機能を含みます。

## メインソースファイル

### ページファイル
- `app/(app)/families/members/child/[id]/view/page.tsx`: 閲覧ページ（リダイレクト専用）
- `app/(app)/children/[id]/page.tsx`: 子供閲覧ページ

### コンポーネント
- `app/(app)/children/[id]/_components/ChildView.tsx`: 子供閲覧画面
- `app/(app)/children/[id]/_components/ChildViewLayout.tsx`: 子供閲覧レイアウト（表示専用）
- `app/(core)/_components/InviteCodePopup.tsx`: 招待コードポップアップ
- `app/(core)/_components/FloatingActionButton.tsx`: 編集FAB

### フック
- `app/(app)/children/[id]/_hook/useChild.ts`: 子供データ取得フック
- `app/(app)/children/[id]/_hooks/useAutoInvitePopup.ts`: 自動ポップアップフック

### レイアウト
- `app/(app)/children/[id]/layout.tsx`: 子供関連ページのレイアウト（FAB含む）

### API（child-management-apiスキル参照）
- `GET /api/children/[id]`: 子供詳細取得
- `GET /api/children/[id]/rewards`: 報酬履歴取得

## 主要機能グループ

### 1. 子供情報表示
- 基本情報（名前、アイコン、年齢、学年）
- 財務情報（残高）
- レベル・経験値
- 登録日

### 2. 招待コード機能
- 招待コード表示ボタン（user_idなしの場合）
- 自動ポップアップ（初回表示時）
- クリップボードコピー
- 使い方説明

### 3. ナビゲーション
- 報酬履歴画面へ遷移
- 編集画面へ遷移（FAB）

## Reference Files Usage

### コンポーネント構造を把握する場合
画面レイアウト、リダイレクト構造、コンポーネント階層を確認：
```
references/component_structure.md
```

### データ表示ロジックを理解する場合
データ取得、変換、招待コード管理ロジックを確認：
```
references/data_display.md
```

### 画面フローを理解する場合
初期表示、リダイレクト、自動ポップアップのフローを確認：
```
references/flow_diagram.md
```

### アクション機能を実装する場合
招待コード表示、FAB、ナビゲーションの実装詳細を確認：
```
references/action_components.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でページフロー確認
2. **レイアウトの理解**: `references/component_structure.md`でコンポーネント階層確認
3. **実装時**: `references/action_components.md`で招待コード機能確認
4. **デバッグ時**: `references/data_display.md`でデータフロー確認

## 実装上の注意点

### 必須パターン
- 誕生日・年齢
- 学年（自動計算）
- クエスト統計
  - 総受注数
  - 完了数
  - 進行中
  - 総報酬額
  - 未払い報酬

**学年計算ロジック:**
- 4月1日時点の年齢を基準に学年を計算
- 6歳未満: 未就学
- 6-11歳: 小学1-6年生
- 12-14歳: 中学1-3年生
- 15-17歳: 高校1-3年生
- 18歳以上: 高校卒業以上

## 処理フロー

### 初期表示時
1. `page.tsx`: authGuardで親認証
2. `page.tsx`: ChildViewコンポーネントを呼び出し
3. `ChildView`: useChildフックで子供データ取得
4. `ChildView`: user_idが存在しない場合、招待コードポップアップを表示
5. `ChildViewLayout`: 子供情報をレイアウト表示

### 招待コード表示
1. ユーザーが「招待コード表示」ボタンをクリック
2. InviteCodePopupを開く
3. 招待コードとQRコードを表示

### 編集画面遷移
1. ユーザーが「編集」ボタンをクリック
2. `FAMILIES_MEMBERS_CHILD_EDIT_URL(id)` へ遷移

### 報酬履歴画面遷移
1. ユーザーがランクカードをクリック
2. `CHILD_REWARDS_URL(id)` へ遷移

## エンドポイント

### 画面URL
- `FAMILIES_MEMBERS_CHILD_VIEW_URL(childId)`: 家族メンバー子供閲覧画面

### API URL
- child-management-apiスキルを参照

## 注意点

- 閲覧画面はAPI呼び出しを含む（Screenの役割）
- ChildViewLayoutはレイアウト専念（API呼び出し禁止）
- 親のみアクセス可能
- user_idが存在しない場合は招待コード機能を提供
- 子供管理画面（`app/(app)/children/[id]/view/`）と同じコンポーネントを使用
