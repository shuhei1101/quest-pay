---
name: family-member-child-view
description: 家族メンバー子供閲覧画面の構造知識を提供するスキル。ファイル構成、表示内容、招待コード機能を含む。
---

# 家族メンバー子供閲覧 スキル

## 概要

家族メンバー子供閲覧画面は、家族編集の文脈で子供情報を表示する画面。招待コード表示機能を含む。

## ファイル構成

### メインファイル
- `app/(app)/families/members/child/[id]/view/page.tsx`: 閲覧ページ（リダイレクト専用）

### 使用コンポーネント
- `app/(app)/children/[id]/_components/ChildView.tsx`: 子供閲覧画面
- `app/(app)/children/[id]/_components/ChildViewLayout.tsx`: 子供閲覧レイアウト
- `app/(core)/_components/InviteCodePopup.tsx`: 招待コードポップアップ

### フック
- `app/(app)/children/[id]/_hook/useChild.ts`: 子供データ取得フック

### API（child-management-apiスキル参照）
- `GET /api/children/[id]`: 子供詳細取得
- `GET /api/children/[id]/rewards`: 報酬履歴取得

## 主要コンポーネント

### ChildView
**責務:** 子供情報の表示管理

**主要機能:**
- 子供詳細情報の表示（レイアウトに委譲）
- 招待コード表示ボタン（user_idが存在しない場合のみ）
- 編集ボタン → 編集画面へ遷移
- 報酬履歴ボタン → 報酬履歴画面へ遷移

**注意点:**
- user_idが存在しない場合、自動で招待コードポップアップを表示
- 親のみアクセス可能（authGuard: childNG, guestNG）

### ChildViewLayout
**責務:** 子供情報のレイアウト表示（データ表示のみ、API呼び出し禁止）

**デザイン:** カード分割型 + 経験値円グラフ

**表示項目:**

1. **プロフィールカード**
   - 子供名
   - アイコン（グラデーション背景の円形）
   - 誕生日・年齢・学年（アイコン付き）

2. **レベル・経験値カード**
   - 円グラフ（RingProgress）で経験値の進捗を視覚化
   - 中央にレベル表示
   - 現在の経験値（currentExp）
   - 次のレベルまでの経験値（nextLevelExp - currentExp）
   - 進捗バー

3. **クエスト実績カード**
   - ランク（ThemeIcon付き）
   - 達成クエスト数
   - 進行中のクエスト数

4. **お金の管理カード**
   - 今月の報酬（強調表示、黄色背景）
   - 合計報酬額（TODO: APIデータ対応予定）
   - 定額報酬（TODO: APIデータ対応予定）
   - 現在の貯金（クリック可能、報酬履歴へ遷移）

**経験値計算ロジック:**
- `totalExp`: 累積経験値
- レベルごとの必要経験値: `レベル × 100`
- 現在レベルでの経験値: `totalExp - (レベル1からの累積経験値)`
- 次のレベルまで: `現在レベルの必要経験値 - 現在レベルでの経験値`

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
1. ユーザーが「現在の貯金」カードをクリック
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
