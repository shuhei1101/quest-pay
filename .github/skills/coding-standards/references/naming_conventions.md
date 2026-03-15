(2026年3月記載)

# 命名規則

## コンポーネント命名

### 画面コンポーネント
- **閲覧画面**: `XxxView`
- **編集画面**: `XxxEdit`
- **一覧画面**: `XxxList`
- **画面本体**: `XxxScreen`
- **レイアウト**: `XxxLayout`

**例:**
```tsx
// 閲覧画面
export const QuestView = () => { /* ... */ }

// 編集画面
export const QuestEdit = () => { /* ... */ }

// 一覧画面
export const QuestList = () => { /* ... */ }

// 画面本体
export const QuestsScreen = () => { /* ... */ }

// レイアウト
export const QuestsLayout = () => { /* ... */ }
```

### 共通コンポーネント
- PascalCaseを使用
- 用途が明確に分かる名前

**例:**
```tsx
export const LoadingButton = () => { /* ... */ }
export const ScreenWrapper = () => { /* ... */ }
export const ScrollableTabs = () => { /* ... */ }
```

## ファイル命名

### コンポーネントファイル
- `.tsx`拡張子
- PascalCase

**例:**
```
QuestView.tsx
QuestEdit.tsx
QuestsScreen.tsx
QuestsLayout.tsx
```

### ユーティリティファイル
- `.ts`拡張子
- camelCase

**例:**
```
client.ts
route.ts
service.ts
query.ts
db.ts
```

### フックファイル
- `.ts`拡張子
- `use`プレフィックス + PascalCase

**例:**
```
useQuests.ts
useChildForm.ts
useLoadingContext.ts
```

## 変数命名

### 一般的な変数
- camelCaseを使用
- 意味が明確に分かる名前

**例:**
```ts
const questId = "123"
const familyName = "田中家"
const isLoading = false
const hasError = true
```

### Boolean変数
- `is`, `has`, `should`, `can`などのプレフィックス

**例:**
```ts
const isLoading = false
const hasChildren = true
const shouldRedirect = false
const canEdit = true
```

### 配列
- 複数形を使用

**例:**
```ts
const quests = await fetchQuests()
const children = await fetchChildren()
const items = [1, 2, 3]
```

### 定数
- 通常の変数と同じcamelCase
- 真にグローバルな定数の場合のみSCREAMING_SNAKE_CASE

**例:**
```ts
// Good - 通常の定数
const maxRetries = 3
const defaultTimeout = 5000

// Good - グローバル定数
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const MAX_FILE_SIZE = 10 * 1024 * 1024
```

## 関数命名

### イベントハンドラ
- `handle`プレフィックス + 動詞

**例:**
```ts
const handleSubmit = () => { }
const handleClick = () => { }
const handleChange = () => { }
const handleDelete = () => { }
```

### 非同期関数
- 動詞から始める
- `fetch`, `create`, `update`, `delete`などの動詞を使用

**例:**
```ts
const fetchQuests = async () => { }
const createQuest = async (data: QuestData) => { }
const updateQuest = async (id: string, data: QuestData) => { }
const deleteQuest = async (id: string) => { }
```

### バリデーション関数
- `validate`プレフィックス

**例:**
```ts
const validateForm = (data: FormData) => { }
const validateEmail = (email: string) => { }
```

### 変換関数
- `convert`または`transform`プレフィックス、もしくは`to`プレフィックス

**例:**
```ts
const convertToQuestData = (raw: RawData) => { }
const transformResponse = (data: ApiResponse) => { }
const toDisplayFormat = (date: Date) => { }
```

## API命名

### エンドポイント
- RESTful命名規則に従う
- 複数形を使用

**例:**
```
/api/quests              # 一覧取得、作成
/api/quests/[id]         # 詳細取得、更新、削除
/api/quests/[id]/publish # 公開
```

### クライアント関数
- HTTP動詞 + リソース名

**例:**
```ts
export const getQuests = async () => { }
export const getQuest = async (id: string) => { }
export const createQuest = async (data: QuestData) => { }
export const updateQuest = async (id: string, data: QuestData) => { }
export const deleteQuest = async (id: string) => { }
```

## データベース命名

### テーブル名
- snake_case
- 複数形

**例:**
```
family_quests
child_quests
public_quests
quest_categories
```

### カラム名
- snake_case

**例:**
```
quest_id
family_id
created_at
updated_at
```

### 関数名（DB関数）
- 動詞 + テーブル名（単数形）

**例:**
```ts
export const createQuest = async () => { }
export const updateQuest = async () => { }
export const deleteQuest = async () => { }
export const getQuest = async () => { }
export const listQuests = async () => { }
```
