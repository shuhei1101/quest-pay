---
name: family-member-list
description: 家族メンバー一覧画面の構造知識を提供するスキル。2ペイン設計、レイアウトパターン、コンポーネント構成を含む。
---

# 家族メンバー一覧 スキル

## 概要

家族メンバー一覧画面は、親と子供のメンバーを一覧表示し、個別の詳細画面へ遷移する画面。PC時は2ペイン表示、スマホ時は一覧と詳細を切り替える設計。

## ファイル構成

### メインファイル
- `app/(app)/families/members/page.tsx`: メンバー一覧ページ（親のみアクセス可）
- `app/(app)/families/members/layout.tsx`: 2ペインレイアウト実装
- `app/(app)/families/members/FamilyMemberListScreen.tsx`: 一覧画面（空実装）

### コンポーネント
- `app/(app)/families/members/_components/FamilyMemberList.tsx`: メンバー一覧表示
- `app/(app)/children/_components/ChildCardLayout.tsx`: 子供カード
- `app/(app)/parents/_components/ParentCardLayout.tsx`: 親カード

### フック
- `app/(app)/children/_hook/useChildren.ts`: 子供データ取得
- `app/(app)/parents/_hook/useParents.ts`: 親データ取得

## 2ペイン設計の実装

### layout.tsx の役割

**責務:** PC/モバイルで異なるレイアウトを提供

**PC表示（2ペイン）:**
```tsx
<div className="flex h-full" style={{ gap: "1rem" }}>
  {/* 左ペイン: 一覧 (幅1/3) */}
  <aside className="w-1/3" style={{ borderRight: "1px solid #e0e0e0", paddingRight: "1rem", overflowY: "auto" }}>
    <FamilyMemberList selectedId={selectedId} />
  </aside>
  {/* 右ペイン: 詳細 (残りの幅) */}
  <main className="flex-1" style={{ paddingLeft: "1rem", overflowY: "auto" }}>
    {children}
  </main>
</div>
```

**スタイルのポイント:**
- ペイン間のgap: `1rem`
- 仕切り線: `borderRight: "1px solid #e0e0e0"`（明るいグレー）
- 左ペインのパディング: `paddingRight: "1rem"`
- 右ペインのパディング: `paddingLeft: "1rem"`
- スクロール: 両ペインとも`overflowY: "auto"`

**モバイル表示:**
- `selectedId`が`null` → 一覧を表示
- `selectedId`が存在 → 詳細（`children`）を表示

**selectedId の取得:**
- URLから選択中のIDを抽出
- パターン: `/families/members/parent/{id}` または `/families/members/child/{id}`

### FloatingActionButton

**位置:** 右下
**パターン:** `radial-up`（円形に展開）
**アクション:**
- 子供新規追加（`FAMILIES_MEMBERS_CHILD_NEW_URL`）
- 子供編集（子供閲覧画面表示時のみ、`FAMILIES_MEMBERS_CHILD_EDIT_URL(childId)`）

**条件分岐:**
- `/families/members/child/{id}/view`の場合 → 編集ボタン（IconEdit）を追加
- それ以外 → 新規追加ボタン（IconAdjustments）のみ

## コンポーネント構造

### FamilyMemberList

**責務:** 親と子供の一覧を表示（ミニマルリスト型）

**表示内容:**
1. 親セクション（見出し + `ParentCardLayout`）
2. 区切り線（`Divider`）
3. 子供セクション（見出し + `ChildCardLayout`）

**レイアウト:**
- `Card` + `Stack gap={4}`: コンパクトなリスト表示
- `Card`の高さ: `height: "100%"` で親要素いっぱいに広げる（背景色を下まで表示）
- セクションタイトル: `Text size="xs" fw={600} c="dimmed"`

**Props:**
- `selectedId`: 現在選択中のメンバーID（ハイライト表示用）

**データ取得:**
- `useParents()`: 親データ取得
- `useChildren()`: 子供データ + クエスト統計取得

**遷移先:**
- 親カードクリック → `FAMILIES_MEMBERS_PARENT_VIEW_URL(parentId)`
- 子供カードクリック → `FAMILIES_MEMBERS_CHILD_VIEW_URL(childId)`

### ParentCardLayout

**責務:** 親の情報をミニマルリスト形式で表示

**表示項目:**
- アバター（32px、円形、グラデーション背景）
- 名前

**Props:**
- `parent`: 親データ
- `onClick`: カードクリック時のコールバック
- `isSelected`: 選択状態（左ボーダー + 背景色変更）

**スタイル:**
- コンテナ: `Box` + `px="xs" py="sm"`
- 選択時: 左ボーダー3px（#667eea）、背景色（#F0F4FF）
- 非選択時: 左ボーダー3px透明、背景色透明
- ホバー時: `hover:bg-gray-50`
- テーマ対応: テキスト色のみ`useTheme()`から取得

### ChildCardLayout

**責務:** 子供の情報をミニマルリスト形式で表示

**表示項目:**
- アバター（32px、円形、グラデーション背景）
- 名前
- レベル（Badge、xs、violet）

**Props:**
- `child`: 子供データ
- `questStats`: クエスト統計（未使用）
- `onClick`: カードクリック時のコールバック
- `isSelected`: 選択状態（左ボーダー + 背景色変更）

**1行目:** 名前（truncate） + レベルBadge

**スタイル:**
- コンテナ: `Box` + `px="xs" py="sm"`
- 選択時: 左ボーダー3px（#667eea）、背景色（#F0F4FF）
- 非選択時: 左ボーダー3px透明、背景色透明
- ホバー時: `hover:bg-gray-50`
- テーマ対応: テキスト色のみ`useTheme()`から取得

## レイアウトパターン

### 現在の実装（ミニマルリスト型）

**特徴:**
- 1行で表示（アバター32px + 名前 + バッジ）
- 左ボーダー3pxで選択状態を表現
- 最もコンパクトで多くのメンバーを表示可能
- `Card` + `Stack gap={4}` でリスト全体をまとめる
- セクション分け（親 / 子供）で視認性向上

**適用場面:**
- 2ペイン表示の左ペイン（最小幅）
- メンバーが多い場合に最適

**実装日:** 2026年2月24日

### 推奨パターン（他の選択肢）

#### 1. コンパクトリスト型
**特徴:**
- アイコン44px + 名前 + 最小限の情報
- 選択状態をボーダー2pxで表現
- 高さを抑えて多くのメンバーを表示可能

**適用場面:**
- 2ペイン表示の左ペイン（中幅）
- メンバーが多い場合

#### 2. ミニマルリスト型（現在の実装）
**特徴:**
- 1行で表示（アバター32px + 名前 + バッジ）
- 最もコンパクト
- 左ボーダー3pxで選択状態を表現

**適用場面:**
- 2ペイン表示の左ペイン（最小幅）
- メンバーが非常に多い場合

#### 3. カード詳細型
**特徴:**
- 多くの情報を同時表示（経験値、クエスト統計、プログレスバーなど）
- カードサイズが大きい（`Card` + `SimpleGrid`）
- 視覚的にリッチ

**適用場面:**
- 全画面表示
- モバイル表示
- 詳細情報を一覧で確認したい場合

## エンドポイント

### 画面URL
- `FAMILIES_MEMBERS_URL`: `/families/members` - メンバー一覧（親のみ）
- `FAMILIES_MEMBERS_PARENT_VIEW_URL(parentId)`: `/families/members/parent/${parentId}/view`
- `FAMILIES_MEMBERS_CHILD_VIEW_URL(childId)`: `/families/members/child/${childId}/view`
- `FAMILIES_MEMBERS_CHILD_NEW_URL`: `/families/members/child/new`

### API URL
- `GET /api/parents`: 親一覧取得
- `GET /api/children`: 子供一覧 + クエスト統計取得

## 処理フロー

### 初期表示（PC）
1. `page.tsx`: authGuardで親認証
2. `layout.tsx`: `useWindow()`でPC判定
3. `layout.tsx`: URLから`selectedId`を取得
4. `layout.tsx`: 2ペイン表示
   - 左: `FamilyMemberList`（`selectedId`渡す）
   - 右: `children`（詳細画面）
5. `FamilyMemberList`: 親と子供のデータを取得して表示

### 初期表示（モバイル）
1. `page.tsx`: authGuardで親認証
2. `layout.tsx`: `useWindow()`でモバイル判定
3. `layout.tsx`: URLから`selectedId`を取得
4. `selectedId`が`null` → `FamilyMemberList`表示
5. `selectedId`が存在 → `children`（詳細画面）表示

### メンバー選択
1. ユーザーがカードをクリック
2. `onClick`コールバック実行
3. `router.push()`で詳細画面へ遷移
4. URLが変わり、`selectedId`が更新される
5. PC: 左ペインで選択状態がハイライト、右ペインに詳細表示
6. モバイル: 詳細画面に切り替わる

### 新規子供追加
1. FloatingActionButtonをクリック
2. `FAMILIES_MEMBERS_CHILD_NEW_URL`へ遷移
3. 子供新規登録画面表示

## 注意点

### 2ペイン設計のポイント
- **左ペインの幅**: `w-1/3`（全体の1/3）がちょうど良い
- **ペイン間のスペース**: `gap: "1rem"` で適切な余白を確保
- **仕切り線**: `borderRight: "1px solid #e0e0e0"` で明るいグレー（濃すぎない）
- **パディング**: 左ペイン`paddingRight: "1rem"`、右ペイン`paddingLeft: "1rem"` で余白を確保
- **スクロール**: 両ペインとも`overflowY: "auto"`で独立したスクロール
- **コンパクトなデザイン**: 左ペインには多くのメンバーを表示できるようにする
- **選択状態の明確化**: 左ボーダー3px、背景色で選択を明示
- **SSR対応**: `useWindow()`で判定前に`mounted`チェック

### パフォーマンス
- `useChildren()`と`useParents()`は並列実行
- クエスト統計も同時取得（N+1問題を回避）

### アクセス制限
- 親のみアクセス可能（`authGuard: childNG, guestNG`）
- 子供・ゲストは`QUESTS_URL`へリダイレクト

## モック画面

デザイン案の確認: `/test/family-member-list-mock`

**3つのデザインパターン:**
1. コンパクトリスト型（2ペイン向け）
2. カード詳細型（現在の実装）
3. ミニマルリスト型（最小幅）

**2ペイン表示プレビュー:** 実際の左右分割を確認可能
