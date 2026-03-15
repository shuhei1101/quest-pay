# ログイン画面 コンポーネント構造

**最終更新:** 2026年3月記載

## ファイル構成

### メインファイル
- `app/(auth)/login/page.tsx`: ログインページ（リダイレクト専用）
- `app/(auth)/login/LoginScreen.tsx`: ログイン画面実装
- `app/(auth)/login/form.ts`: フォームスキーマ定義

### コンポーネント
- `app/(auth)/login/_components/LoginTypeSelectPopup.tsx`: ログインタイプ選択ポップアップ

### 共通コンポーネント
- `app/(core)/_components/FeedbackMessageWrapper.tsx`: フィードバックメッセージ表示
- `app/(core)/_components/AccessErrorHandler.tsx`: アクセスエラーハンドラ

## LoginScreen コンポーネント

### 責務
ログイン画面の表示と処理管理

### レイアウト構造
```
div (min-h-screen, centered)
├── Paper (shadow, padding)
│   ├── Title Section (タイトル、説明文)
│   └── Form
│       ├── TextInput (メールアドレス)
│       ├── PasswordInput (パスワード)
│       ├── Checkbox & Anchor (ログイン状態保持、パスワード忘れリンク)
│       ├── Button (ログイン)
│       └── Text & Anchor (新規登録リンク)
├── LoginTypeSelectPopup (初回ログイン時のタイプ選択)
└── FeedbackMessage (エラー・成功メッセージ)
```

### UIコンポーネント使用例
- **Mantine Paper**: `shadow="md"`, `p="xl"`, `radius="md"`
- **Title**: `order={2}` (h2相当)
- **TextInput**: `leftSection` にアイコン配置
- **PasswordInput**: パスワード表示/非表示トグル機能付き
- **Checkbox**: 制御コンポーネントとして実装
- **Button**: `fullWidth`, `size="md"`, `loading` プロパティ

### 初期処理
```typescript
useEffect(() => {
  sessionStorage.clear() // セッションストレージクリア
}, [])
```

## LoginTypeSelectPopup コンポーネント

### 責務
初回ログイン時の親/子供タイプ選択と招待コード入力

### 表示条件
- ログイン成功後、ユーザー情報が存在しない場合に表示
- Modal コンポーネントで実装

### レイアウト構造（家族未登録時）
```
Modal
├── Button (家族を作成する)
├── Section (親として参加)
│   ├── Input (親招待コード)
│   └── Button (親として家族に参加する)
└── Section (子として参加)
    ├── Input (子招待コード)
    └── Button (子として家族に参加する)
```

### レイアウト構造（家族登録済み）
```
Modal
├── Text (家族名表示)
├── Button (親でログイン)
└── Button (子でログイン)
```

### Modal設定
- `withCloseButton={true}`: 閉じるボタン表示
- `closeOnClickOutside={true}`: モーダル外クリックで閉じる
- `closeOnEscape={true}`: ESCキーで閉じる

### 状態管理
```typescript
const [parentInviteCode, setParentInviteCode] = useState("")
const [parentInviteCodeError, setParentInviteCodeError] = useState("")
const [childInviteCode, setChildInviteCode] = useState("")
const [childInviteCodeError, setChildInviteCodeError] = useState("")
```

### ポップアップ起動時の処理
```typescript
useEffect(() => {
  if (!opened) return
  refetch() // ユーザ情報を再取得
  // 状態をリセット
  setParentInviteCode("")
  setParentInviteCodeError("")
  setChildInviteCode("")
  setChildInviteCodeError("")
}, [opened])
```

## アイコン使用

### Tabler Icons
- `IconMail`: メールアドレス入力欄
- `IconLock`: パスワード入力欄

## エラーハンドリング

### AccessErrorHandler
- `useSearchParams` 使用のため `Suspense` でラップ
- クエリパラメータからアクセスエラーを検出して表示

### FeedbackMessage
- `react-hot-toast` によるトースト通知
- ログイン失敗時のエラーメッセージ表示
