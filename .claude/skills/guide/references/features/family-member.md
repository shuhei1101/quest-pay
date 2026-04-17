
# 家族メンバー スキル

## 概要

家族に属するメンバー（親・子供）の一覧表示・子供メンバーの詳細閲覧・編集・招待コード管理を行う機能。

## メインソースファイル

### 画面・コンポーネント（メンバー一覧）
- `packages/web/app/(app)/families/members/page.tsx`: メンバー一覧ページ
- `packages/web/app/(app)/families/members/_components/FamilyMemberList.tsx`: メンバーリスト
  - PC: 左に一覧（w-1/3）、右に詳細（2ペインレイアウト）
  - モバイル: 一覧と詳細を切り替え
- FABで子供の追加・編集

### 画面・コンポーネント（子供メンバー閲覧）
- `packages/web/app/(app)/families/members/child/[id]/view/page.tsx`: 子供メンバー閲覧ページ
- 招待コード表示: `InviteCodePopup`コンポーネント
- `useAutoInvitePopup`: 自動招待コードポップアップ表示フック

### 画面・コンポーネント（子供メンバー編集）
- `packages/web/app/(app)/families/members/child/[id]/page.tsx`: 子供メンバー編集ページ
- `packages/web/app/(app)/children/[id]/_components/ChildEdit.tsx` を再利用

## 主要機能

### 1. メンバー一覧（2ペインレイアウト）
- 親メンバー・子供メンバーをリスト表示
- PC: 左ペインに一覧、右ペインに詳細（同時表示）
- モバイル: 選択時に詳細へ遷移
- FABで子供追加・編集へのナビゲーション

### 2. 子供メンバー閲覧
- 子供プロフィール・クエスト状況・報酬情報表示
- 招待コード表示（`InviteCodePopup`）
- 初回閲覧時に自動招待ポップアップ（`useAutoInvitePopup`）

### 3. 子供メンバー編集
- `ChildEdit` コンポーネントを再利用（`children/[id]` と同じUI）
- 名前・アバター・アイコン変更

## 実装上の注意点

- メンバー一覧の2ペインレイアウトは `useWindow` + `isTablet` で制御
- 招待コードはQRコードと文字列の両方で表示
- 親のみメンバーの編集・招待コード生成が可能
