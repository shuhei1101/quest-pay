(2026年3月記載)

# ベストプラクティス

## コメント規則

### 関数コメント
- 関数や関数呼び出しのコメントは名詞系で終わらせず、`~する`のような形式にすること
- 処理内容を簡潔に説明する

**例:**
```ts
/** 子供情報を取得する */
const fetchChildData = async (childId: string) => {
  // ...
}

/** フォームをバリデーションする */
const validateForm = (data: FormData) => {
  // ...
}

/** 画面を閉じる */
const handleClose = () => {
  // ...
}
```

### JSX内コメント
- JSX内のコンポーネントには細かくコメントを入れること
- ただし、コードの横には極力コメントを書かないこと
- コメントは処理ブロックの上に配置

**例:**
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
      
      {/* 年齢入力欄 */}
      <div>
        <NumberInput label="年齢" {...register("age")} />
      </div>
    </div>
  </form>
</Box>
```

**避けるべきパターン:**
```tsx
// Avoid - コードの横にコメント
<TextInput label="名前" {...register("name")} /> {/* 名前 */}
<NumberInput label="年齢" {...register("age")} /> {/* 年齢 */}
```

## JSXのベストプラクティス

### フローティング部品の配置
- フローティング部品は親JSX要素の一番下に配置すること
- 例: ポップアップ部品、フローティングボタン、モーダル、ドロワーなど

**例:**
```tsx
export const MyComponent = () => {
  return (
    <div>
      {/* メインコンテンツ */}
      <div>
        <h1>タイトル</h1>
        <p>内容</p>
      </div>
      
      {/* フローティングボタン（最後に配置） */}
      <ActionIcon 
        className="fixed bottom-4 right-4 z-50" 
        size="xl"
        onClick={handleAction}
      >
        <IconPlus />
      </ActionIcon>
      
      {/* モーダル（最後に配置） */}
      <Modal opened={isModalOpen} onClose={handleCloseModal}>
        <div>モーダル内容</div>
      </Modal>
    </div>
  )
}
```

## 共通コンポーネント

### 配置場所
- 共通コンポーネントは`app/(core)/_components/`以下に配置すること
- 画面固有のコンポーネントは各画面の`_components/`に配置

### 利用可能な共通コンポーネント
- **共通タブ**: `ScrollableTabs`を使用すること
- **ローディングボタン**: `LoadingButton`を使用すること
- **画面ラッパー**: `ScreenWrapper`を使用すること

**例:**
```tsx
import { ScrollableTabs } from '@/app/(core)/_components/ScrollableTabs'
import { LoadingButton } from '@/app/(core)/_components/LoadingButton'
import { ScreenWrapper } from '@/app/(core)/_components/ScreenWrapper'
```

## エラーハンドリング

### try-catch
- 非同期処理は必ずtry-catchで囲む
- エラーメッセージはユーザーフレンドリーに

**例:**
```ts
const fetchData = async () => {
  try {
    const data = await api.getData()
    return data
  } catch (error) {
    logger.error('データ取得に失敗しました', error)
    throw new Error('データの取得に失敗しました。もう一度お試しください。')
  }
}
```

### エラー型チェック
- エラーの型を確認してから処理

**例:**
```ts
try {
  // ...
} catch (error) {
  if (error instanceof ApiError) {
    logger.error('API エラー', error)
  } else if (error instanceof ValidationError) {
    logger.error('バリデーション エラー', error)
  } else {
    logger.error('予期せぬエラー', error)
  }
}
```

## パフォーマンス

### useMemoとuseCallback
- 不要なuseMemo/useCallbackは避ける
- パフォーマンス問題が確認できたときのみ使用

**例:**
```tsx
// Good - 本当に必要な場合のみ
const expensiveCalculation = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0)
}, [items])

// Avoid - 不要なメモ化
const simpleValue = useMemo(() => props.value * 2, [props.value])  // 不要
```

### 条件付きレンダリング
- 早期リターンを活用

**例:**
```tsx
export const MyComponent = ({ data }: { data?: Data }) => {
  // Good - 早期リターン
  if (!data) return null
  
  return <div>{data.name}</div>
}

// Avoid - ネストした条件
export const MyComponent = ({ data }: { data?: Data }) => {
  return (
    <>
      {data && (
        <div>{data.name}</div>
      )}
    </>
  )
}
```

## 依存関係管理

### import順序
1. React関連
2. 外部ライブラリ
3. 内部モジュール（絶対パス）
4. 相対パス

**例:**
```tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, TextInput } from '@mantine/core'

import { useQuests } from '@/app/api/quests/query'
import { ScreenWrapper } from '@/app/(core)/_components/ScreenWrapper'

import { QuestCard } from './_components/QuestCard'
```

### 循環依存の回避
- 循環依存は避ける
- 共通の型は別ファイルに分離

## テスト

### テストファイル
- テストファイルは`__tests__`ディレクトリに配置
- ファイル名は`*.test.ts`または`*.test.tsx`

### テストの粒度
- 単一責任でテストを書く
- 1つのテストで1つの振る舞いを確認
