---
name: coding-standards
description: This skill should be used when writing or reviewing TypeScript, React, or Next.js code for the Quest Pay project. It provides coding conventions including style rules, naming conventions, comment formats, and preferred language constructs.
---

# Coding Standards

## Overview

このスキルは、お小遣いクエストボードプロジェクトにおけるコーディング規約を定義する。コードの一貫性を保つため、すべてのコード作成とレビュー時に適用すること。

## 全般的なルール

### 基本方針
- **言語**: PR、WIP、コメントなどすべて日本語で行うこと
- **セミコロン**: 文末のセミコロンはつけないこと`;`
- **YAGNI原則**: 不要な分割や共通化は避けること
  - 例: 関数の引数の型をその場でしか使わないにも関わらず、`type XxxParams`と定義することはNG
  - 必要になった際に定義しなおすこと
- **index.ts**: 極力作成しないこと（理由がある場合のみ作成可）
- **仮ファイル**: `tmp/`ディレクトリ以下に作成すること

## 型定義

### typeとinterface
- 理由がない場合、`type`を使用すること
- `interface`は明確な拡張性が必要な場合のみ使用

### entity.tsの参照
- `entity.ts`ファイルにZodスキーマの型を共有しているため、必要であればこちらを利用すること
- 間違っても同じような型を生成しないこと
- DBのカラムと同じ意味の変数や引数を定義するときは、`entity.ts`の型内を参照すること（もしくはUnionを使用）
- Entity定義を変えたときに自動で変わるようにすること

**例**:
```ts
type QuestItem = {
  id: QuestEntity["id"]
  category_id?: QuestEntity["category_id"]
  [key: string]: any
}
```

## 関数定義

### 関数の書き方
- 理由がない場合、`function`ではなく、`const`を使用すること

**例**:
```ts
// Good
const handleSubmit = async (data: FormData) => {
  // ...
}

// Avoid (unless there's a specific reason)
function handleSubmit(data: FormData) {
  // ...
}
```

## JSX/TSXファイル

### コンポーネント定義
- 理由がない場合、`function`ではなく、`const`を使用すること
- `export default`の場合のみ`function`を使う（`page.tsx`など）

**例**:
```tsx
// Good - 通常のコンポーネント
export const MyComponent = () => {
  return <div>...</div>
}

// Good - page.tsx
export default function Page() {
  return <div>...</div>
}
```

### Props定義
- Props部分は理由がない場合、分割してexportせず、直接引数部分（インライン）に書くこと

**例**:
```tsx
// Good
export const useChildForm = ({childId}: {childId?: string}) => {
  const router = useRouter()
  // ...
}

// Avoid
type UseChildFormProps = {
  childId?: string
}
export const useChildForm = ({childId}: UseChildFormProps) => {
  // ...
}
```

### フローティング部品の配置
- フローティング部品は親JSX要素の一番下に配置すること
- 例: ポップアップ部品、フローティングボタンなど

## コメント規則

### 関数コメント
- 関数や関数呼び出しのコメントは名詞系で終わらせず、`~する`のような形式にすること
- 例: `親情報を取得する。`, `画面を閉じる`など

**例**:
```ts
/** 子供情報を取得する */
const fetchChildData = async (childId: string) => {
  // ...
}
```

### JSX内コメント
- JSX内のコンポーネントには細かくコメントを入れること
- ただし、コードの横には極力コメントを書かないこと

**例**:
```tsx
<Box pos="relative" className="max-w-120">
  {/* ロード中のオーバーレイ */}
  <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
  
  {/* 子供入力フォーム */}
  <form onSubmit={handleSubmit((form) => handleRegister({form}))}>
    {/* 入力欄のコンテナ */}
    <div className="flex flex-col gap-2">
      {/* 子供名入力欄 */}
      <div>
        <TextInput label="名前" {...register("name")} />
      </div>
    </div>
  </form>
</Box>
```

## 命名規則

### 画面コンポーネント
- 閲覧画面: `〇〇View`
- 編集画面: `〇〇Edit`

**例**:
```tsx
// 閲覧画面
export const QuestView = () => { /* ... */ }

// 編集画面
export const QuestEdit = () => { /* ... */ }
```

## 共通コンポーネント

### 配置場所
- 共通コンポーネントは`app/(core)/_components/`以下に配置すること

### 利用可能な共通コンポーネント
- **共通タブ**: `ScrollableTabs`を使用すること
