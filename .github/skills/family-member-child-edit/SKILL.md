---
name: family-member-child-edit
description: 家族メンバー子供編集画面の構造知識を提供するスキル。ファイル構成、フォーム管理、バリデーション、処理フローを含む。
---

# 家族メンバー子供編集 スキル

## 概要

家族メンバー子供編集画面は、家族編集の文脈で子供情報を作成・更新する画面。

## ファイル構成

### メインファイル
- `app/(app)/families/members/child/[id]/page.tsx`: 編集ページ（リダイレクト専用）
- `app/(app)/families/members/child/new/page.tsx`: 新規追加ページ

### 使用コンポーネント
- `app/(app)/children/[id]/_components/ChildEdit.tsx`: 子供編集フォーム
- `app/(app)/icons/_components/IconSelectPopup.tsx`: アイコン選択ポップアップ
- `app/(app)/icons/_components/RenderIcon.tsx`: アイコン描画

### フック
- `app/(app)/children/[id]/_hook/useChildForm.ts`: 子供フォーム管理フック
- `app/(app)/children/[id]/_hook/useRegisterChild.ts`: 子供登録フック
- `app/(app)/icons/_hooks/useIcons.ts`: アイコンデータ取得フック

### API（child-management-apiスキル参照）
- `POST /api/children`: 新規子供登録
- `PUT /api/children/[id]`: 子供情報更新

## 主要コンポーネント

### ChildForm（ChildEdit.tsx）
**責務:** 子供情報の入力・保存管理

**主要機能:**
- 子供名入力
- アイコン選択
  - アイコン種類選択
  - アイコンカラー選択
- 誕生日入力（DateInput）
- 保存ボタン

**フォーム項目:**
```typescript
{
  name: string           // 子供の名前（必須）
  iconId: number         // アイコンID（必須）
  iconColor: string      // アイコンカラー（必須）
  birthday: string       // 誕生日（必須）
}
```

**バリデーション:**
- name: 必須
- iconId: 必須
- iconColor: 必須
- birthday: 必須

**注意点:**
- 親のみ編集可能（authGuard: childNG, guestNG）
- 新規作成時はidがundefined
- 更新時はidが存在

## 処理フロー

### 初期表示時（新規作成）
1. `page.tsx`: authGuardで親認証
2. `page.tsx`: ChildFormコンポーネントを呼び出し（id未指定）
3. `ChildForm`: useChildFormフックで空フォームを初期化
4. `ChildForm`: フォームを表示

### 初期表示時（更新）
1. `page.tsx`: authGuardで親認証
2. `page.tsx`: ChildFormコンポーネントを呼び出し（id指定）
3. `ChildForm`: useChildFormフックで子供データ取得
4. `ChildForm`: フォームに子供データを表示

### アイコン選択
1. ユーザーがアイコンボタンをクリック
2. IconSelectPopupを開く
3. ユーザーがアイコン種類とカラーを選択
4. setIconとsetColorでフォームを更新

### 保存
1. ユーザーが「保存」ボタンをクリック
2. handleSubmitでバリデーション実行
3. バリデーション成功 → useRegisterChild.handleRegisterを呼び出し
4. 新規作成の場合: POST /api/children
5. 更新の場合: PUT /api/children/[id]
6. 成功時: トースト通知「保存しました」
7. 新規作成成功時: 編集画面へリダイレクト

## エンドポイント

### 画面URL
- `FAMILIES_MEMBERS_CHILD_EDIT_URL(childId)`: 家族メンバー子供編集画面
- `FAMILIES_MEMBERS_CHILD_NEW_URL`: 新規子供追加画面

### API URL
- child-management-apiスキルを参照

## 注意点

- フォーム管理はuseChildFormフック
- 保存処理はuseRegisterChildフック
- 親のみアクセス可能
- 新規作成時はidがundefined、更新時はidが存在
- 子供管理画面（`app/(app)/children/[id]/`）と同じコンポーネントを使用
