---
name: family-member-child-edit
description: 家族メンバー子供編集画面の構造知識を提供するスキル。ファイル構成、フォーム管理、バリデーション、処理フローを含む。 Trigger Keywords: 家族メンバー編集、メンバー編集、メンバーフォーム、子供メンバー
---

# 家族メンバー子供編集 スキル

## 概要

このスキルは、家族メンバーとして子供情報を作成・更新する編集画面の知識を提供します。子供名、アイコン、誕生日の入力管理を担当します。

## メインソースファイル

### ページ
- `app/(app)/families/members/child/[id]/page.tsx`: 編集ページ
- `app/(app)/families/members/child/new/page.tsx`: 新規追加ページ

### コンポーネント
- `app/(app)/children/[id]/_components/ChildEdit.tsx`: 子供編集フォーム
- `app/(app)/icons/_components/IconSelectPopup.tsx`: アイコン選択ポップアップ
- `app/(app)/icons/_components/RenderIcon.tsx`: アイコン描画

### フック
- `app/(app)/children/[id]/_hook/useChildForm.ts`: フォーム状態管理
- `app/(app)/children/[id]/_hook/useRegisterChild.ts`: 登録・更新処理
- `app/(app)/icons/_hooks/useIcons.ts`: アイコンマスタデータ

### フォームスキーマ
- `app/(app)/children/[id]/form.ts`: Zodスキーマ定義

### データベース
- `drizzle/schema.ts`: children, profiles, icons

## 主要機能グループ

### 1. フォーム管理
- 子供名、アイコン、誕生日の入力制御
- フォームバリデーション (Zod)
- 変更検出とデータ保持

### 2. アイコン選択
- IconSelectPopupによるアイコン種類・カラー選択
- リアルタイムプレビュー

### 3. データ永続化
- 新規作成: POST /api/children
- 更新: PUT /api/children/[id]
- React Query によるキャッシュ管理

## Reference Files Usage

### コンポーネント構造を把握する場合
画面階層、主要コンポーネント、フォームレイアウトを確認：
```
references/component_structure.md
```

### フォーム管理を理解する場合
スキーマ定義、状態管理、送信処理を確認：
```
references/form_management.md
```

### 画面フローを理解する場合
新規作成・更新フロー、エラーハンドリング、認証フローを確認：
```
references/flow_diagram.md
```

### バリデーションルールを確認する場合
フィールド別制約、エラーメッセージ、検証タイミングを確認：
```
references/validation_rules.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md` で新規作成・更新フロー確認
2. **フォーム理解**: `references/form_management.md` でスキーマと状態管理確認
3. **実装時**: `references/component_structure.md` でコンポーネント階層確認
4. **バリデーション追加時**: `references/validation_rules.md` で制約ルール確認

## 実装上の注意点

### 必須パターン

1. **認証制御**
   - 親ユーザーのみアクセス可能
   - authGuard で childNG: true, guestNG: true を設定

2. **フォーム状態管理**
   - useChildForm でフォーム状態を一元管理
   - Zod によるバリデーション必須

3. **データ取得と更新の分岐**
   - 新規作成: id が undefined
   - 更新: id が存在
   - useChildForm が自動判定

4. **React Query キャッシュ**
   - キーは `["Child", childId]` と `["children"]`
   - 更新後は両方のキャッシュを無効化

5. **アイコン選択**
   - IconSelectPopup コンポーネントを使用
   - iconId と iconColor を同時に設定

### アンチパターン（避けるべき実装）

❌ **認証チェックの省略**
```typescript
// NG: authGuard を省略
export default async function Page() {
  return <ChildForm />
}
```

❌ **直接API呼び出し**
```typescript
// NG: フックを使わず直接fetch
const handleSave = async () => {
  await fetch("/api/children", { method: "POST", ... })
}
```

❌ **バリデーションの省略**
```typescript
// NG: Zodスキーマなしでフォーム送信
const handleSubmit = (data: any) => {
  handleRegister(data) // 型安全性なし
}
```

### よくある実装ミス

1. **新規作成後にIDが更新されない**
   - `setId` を useRegisterChild に渡し忘れ
   - 編集画面への遷移が失敗

2. **DateInput のロケール設定忘れ**
   - `locale="ja"` を設定しないと英語表示

3. **LoadingOverlay の条件不足**
   - `isLoading` と `isSubmitting` 両方をチェック

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


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
