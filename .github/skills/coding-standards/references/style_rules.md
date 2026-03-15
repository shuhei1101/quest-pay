(2026年3月記載)

# スタイルルール

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

**例:**
```ts
// Good - type使用
type UserData = {
  id: string
  name: string
}

// Avoid - interface（拡張が不要な場合）
interface UserData {
  id: string
  name: string
}

// OK - interface（拡張が必要な場合）
interface BaseEntity {
  id: string
  created_at: Date
}

interface User extends BaseEntity {
  name: string
}
```

### entity.tsの参照
- `entity.ts`ファイルにZodスキーマの型を共有しているため、必要であればこちらを利用すること
- 間違っても同じような型を生成しないこと
- DBのカラムと同じ意味の変数や引数を定義するときは、`entity.ts`の型内を参照すること（もしくはUnionを使用）
- Entity定義を変えたときに自動で変わるようにすること

**例:**
```ts
import type { QuestEntity } from '@/drizzle/entity'

// Good - entity.tsの型を参照
type QuestItem = {
  id: QuestEntity["id"]
  category_id?: QuestEntity["category_id"]
  title: QuestEntity["title"]
}

// Avoid - 型を再定義
type QuestItem = {
  id: string
  category_id?: number
  title: string
}
```

## 関数定義

### 関数の書き方
- 理由がない場合、`function`ではなく、`const`を使用すること

**例:**
```ts
// Good - const使用
const handleSubmit = async (data: FormData) => {
  // ...
}

// Good - アロー関数の省略記法
const calculateTotal = (items: Item[]) => 
  items.reduce((sum, item) => sum + item.price, 0)

// Avoid - function（明確な理由がない場合）
function handleSubmit(data: FormData) {
  // ...
}
```

### 関数の命名
- 動詞から始める
- 単一責任の原則に従う
- 処理内容が明確に分かる名前にする

**例:**
```ts
// Good
const fetchUserData = async (userId: string) => { }
const validateForm = (data: FormData) => { }
const calculateReward = (quest: Quest) => { }

// Avoid
const data = async (id: string) => { }  // 不明確
const check = (form: FormData) => { }    // 何をチェックするか不明
```

## コンポーネント定義

### コンポーネントの書き方
- 理由がない場合、`function`ではなく、`const`を使用すること
- `export default`の場合のみ`function`を使う（`page.tsx`など）

**例:**
```tsx
// Good - 通常のコンポーネント
export const MyComponent = () => {
  return <div>...</div>
}

// Good - page.tsx
export default function Page() {
  return <div>...</div>
}

// Avoid - 通常のコンポーネントでfunction
export function MyComponent() {
  return <div>...</div>
}
```

### Props定義
- Props部分は理由がない場合、分割してexportせず、直接引数部分（インライン）に書くこと

**例:**
```tsx
// Good - インラインProps
export const useChildForm = ({childId}: {childId?: string}) => {
  const router = useRouter()
  // ...
}

export const QuestCard = ({quest, onClick}: {
  quest: Quest
  onClick: () => void
}) => {
  return <div onClick={onClick}>{quest.title}</div>
}

// Avoid - Props型を分離（理由がない場合）
type UseChildFormProps = {
  childId?: string
}
export const useChildForm = ({childId}: UseChildFormProps) => {
  // ...
}

// OK - 複雑なPropsや複数箇所で使う場合
type ComplexComponentProps = {
  quest: Quest
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  isLoading: boolean
  isDisabled: boolean
}
export const ComplexComponent = (props: ComplexComponentProps) => {
  // ...
}
```

## フォーマット

### インデント
- スペース2つ

### 行の長さ
- 特に制限なし（可読性を優先）
- 長すぎる場合は適切に改行

### 改行
- オブジェクトや配列は適切に改行
- チェーンメソッドは各メソッドごとに改行

**例:**
```ts
// Good
const result = await db
  .select()
  .from(questsTable)
  .where(eq(questsTable.id, questId))
  .limit(1)

// Good
const data = {
  id: quest.id,
  title: quest.title,
  description: quest.description,
}

// Avoid
const result = await db.select().from(questsTable).where(eq(questsTable.id, questId)).limit(1)
```
