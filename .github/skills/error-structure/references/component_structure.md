(2026年3月15日 14:30記載)

# エラー画面のコンポーネント構造

## コンポーネント階層

```
エラーハンドリングシステム
├── error.tsx (グローバルエラーハンドラー)
│   └── ErrorPage コンポーネント
│       ├── Center (画面中央配置)
│       └── Paper (カードコンテナ)
│           ├── IconAlertTriangle (警告アイコン)
│           ├── Title (タイトル)
│           ├── Text (説明文)
│           ├── Alert (エラー詳細)
│           └── Stack (アクションボタン群)
│               ├── Button (再読み込み)
│               └── Button (ホームへ戻る)
└── error/unauthorized/ (認証エラー専用)
    ├── page.tsx (ルートページ)
    └── UnauthorizedScreen.tsx (認証エラー画面)
        └── Paper (カードコンテナ)
            ├── IconLock (ロックアイコン)
            ├── Title (タイトル)
            ├── Text (説明文)
            ├── Alert (詳細情報)
            └── Stack (アクションボタン群)
                ├── Button (前のページへ戻る)
                └── Button (ログインページへ)
```

## 主要コンポーネント詳細

### ErrorPage (グローバルエラーハンドラー)
**ファイル**: `packages/web/app/error.tsx`

**責務**:
- アプリケーション全体の予期しないエラーをキャッチ
- エラー情報の視覚的な表示
- ユーザーへの回復手段の提供

**Props**:
```typescript
{
  error: Error & { digest?: string }  // エラーオブジェクト + digest
  reset: () => void                   // エラーリセット関数
}
```

**UI構造**:
```tsx
<Center style={{ minHeight: "70vh" }}>
  <Paper shadow="md" p="xl" withBorder style={{ maxWidth: "500px", width: "100%" }}>
    <Stack gap="lg" align="center">
      {/* アイコン */}
      <IconAlertTriangle size={64} color="orange" />
      
      {/* タイトル */}
      <Title order={2}>予期しないエラーが発生しました</Title>
      
      {/* 説明文 */}
      <Text c="dimmed" ta="center">
        申し訳ございません。予期しないエラーが発生しました。
        <br />
        しばらく時間をおいてから再度お試しください。
      </Text>

      {/* エラー詳細Alert */}
      <Alert color="orange" title="エラー詳細" style={{ width: "100%" }}>
        エラーコード: UNKNOWN_ERROR
        {error.digest && (
          <>
            <br />
            Digest: {error.digest}
          </>
        )}
        <br />
        問題が解決しない場合は、サポートにお問い合わせください。
      </Alert>

      {/* アクションボタン */}
      <Stack gap="sm" style={{ width: "100%" }}>
        <Button
          leftSection={<IconRefresh size={16} />}
          fullWidth
          onClick={() => reset()}
        >
          再読み込み
        </Button>
        
        <Button
          leftSection={<IconHome size={16} />}
          variant="light"
          fullWidth
          onClick={() => router.push(HOME_URL)}
        >
          ホームへ戻る
        </Button>
      </Stack>
    </Stack>
  </Paper>
</Center>
```

**デザイン仕様**:
- **配置**: `Center` で画面中央に配置、`minHeight: "70vh"`
- **カード**: `Paper` コンポーネント、`shadow="md"`, `withBorder`
- **最大幅**: `maxWidth: "500px"` で大画面でも読みやすく
- **アイコン色**: `orange` (警告色)
- **Alert色**: `orange` (警告レベル)
- **ボタン幅**: `fullWidth` で統一感

**アクション**:
1. **再読み込みボタン**: 
   - `reset()` を実行してエラー状態をクリア
   - 同じページを再レンダリング
2. **ホームへ戻るボタン**:
   - `router.push(HOME_URL)` でホーム画面へ遷移
   - `variant="light"` で視覚的階層を作る

### UnauthorizedScreen (認証エラー画面)
**ファイル**: `packages/web/app/error/unauthorized/UnauthorizedScreen.tsx`

**責務**:
- 認証失敗・権限不足エラーの専用表示
- セッションストレージからのフィードバックメッセージ取得
- ログインページへの誘導

**Props**: なし (独立したページコンポーネント)

**内部State**: なし (useEffect でマウント時処理のみ)

**UI構造**:
```tsx
<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
  <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
    {/* アイコン */}
    <Center className="mb-6">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
        <IconLock size={40} color="#ef4444" />
      </div>
    </Center>

    {/* タイトル */}
    <div className="text-center mb-6">
      <Title order={2} className="mb-2">アクセスが制限されています</Title>
      <Text size="sm" c="dimmed">このページを表示する権限がありません</Text>
    </div>

    {/* 説明Alert */}
    <Alert color="red" className="mb-4">
      <Text size="sm">
        申し訳ございません。このページにアクセスする権限がありません。
      </Text>
    </Alert>

    {/* アクションボタン */}
    <Stack gap="sm">
      <Button
        leftSection={<IconArrowLeft size={16} />}
        fullWidth
        variant="light"
        onClick={handleGoBack}
      >
        前のページに戻る
      </Button>
      
      <Button
        leftSection={<IconHome size={16} />}
        fullWidth
        onClick={handleBackToHome}
      >
        ログインページへ
      </Button>
    </Stack>
  </Paper>
</div>
```

**デザイン仕様**:
- **配置**: `min-h-screen flex items-center justify-center` でフルスクリーン中央配置
- **背景**: `bg-gray-50` で微妙に色付け
- **アイコン背景**: `bg-red-100` の円形コンテナ
- **アイコン色**: `#ef4444` (赤色 - エラー色)
- **Alert色**: `red` (エラーレベル)
- **最大幅**: `max-w-md` で読みやすく

**ライフサイクル処理**:
```typescript
useEffect(() => {
  // セッションストレージにメッセージがある場合、表示する
  appStorage.feedbackMessage.out()
}, [])
```
- マウント時にセッションストレージから `FeedbackMessage` を取得して表示
- ページ遷移前に保存されたエラーメッセージがあれば表示

**アクション**:
1. **前のページに戻るボタン**:
   - `router.back()` で履歴を戻る
   - `variant="light"` で副次的なアクション
2. **ログインページへボタン**:
   - `router.push(LOGIN_URL)` でログインページへ遷移
   - プライマリボタン（デフォルトスタイル）

## エラー表示の共通パターン

### アイコン選択
| エラータイプ | アイコン | カラー | 意味 |
|---|---|---|---|
| 予期しないエラー | `IconAlertTriangle` | `orange` | 警告レベル |
| 認証エラー | `IconLock` | `#ef4444` (赤) | アクセス拒否 |

### Alertコンポーネントの使い方
```tsx
<Alert color="orange|red" title="タイトル（オプション）">
  エラー詳細メッセージ
</Alert>
```
- **color**: `orange` (警告), `red` (エラー)
- **title**: エラー詳細のヘッダー（省略可）
- **style**: `{ width: "100%" }` で幅いっぱいに

### Paperコンテナの共通設定
```tsx
<Paper 
  shadow="md"      // 中程度の影
  p="xl"           // 大きめのパディング
  withBorder       // ボーダー付き（グローバルエラー）
  radius="md"      // 中程度の角丸（認証エラー）
>
```

## ボタンアクションの設計

### reset() - エラーリセット
**対象**: グローバルエラーハンドラー

**動作**:
- Next.js Error Boundary の `reset` 関数を実行
- エラー状態をクリアしてコンポーネントを再マウント
- ページ全体をリロードせずに回復を試みる

**使用例**:
```tsx
<Button onClick={() => reset()}>
  再読み込み
</Button>
```

### router.push(HOME_URL) - ホームへ遷移
**対象**: グローバルエラーハンドラー、認証エラー画面

**動作**:
- `HOME_URL` (定数: ホーム画面のパス) へ遷移
- エラー状態から安全な状態へ退避

### router.back() - 履歴を戻る
**対象**: 認証エラー画面

**動作**:
- ブラウザの履歴スタックを1つ戻る
- 直前のページへ戻る（認証が不要だった可能性）

### router.push(LOGIN_URL) - ログインページへ
**対象**: 認証エラー画面

**動作**:
- `LOGIN_URL` (定数: ログインページのパス) へ遷移
- 再認証を促す

## スタイル差異の意図

### グローバルエラー
- **中央配置**: `Center` コンポーネント + `minHeight: "70vh"`
- **意図**: エラーが発生した画面の一部として表示

### 認証エラー
- **フルスクリーン**: `min-h-screen flex items-center justify-center`
- **意図**: 独立したエラーページとして全画面表示

## FeedbackMessageとの連携

### appStorage.feedbackMessage
**ファイル**: `app/(core)/_sessionStorage/appStorage.ts`

**責務**:
- ページ遷移前にセッションストレージにメッセージを保存
- 遷移後のページでメッセージを取り出して表示

**使用方法**:
```typescript
// メッセージ保存（遷移前）
appStorage.feedbackMessage.in({
  type: "error",
  message: "認証に失敗しました"
})

// メッセージ取得（遷移後）
useEffect(() => {
  appStorage.feedbackMessage.out()  // 自動的にtoast表示
}, [])
```

**表示コンポーネント**:
```tsx
<FeedbackMessage />  // レイアウトに配置
```

## レスポンシブ対応

### グローバルエラー
- `maxWidth: "500px"` で大画面での幅制限
- `width: "100%"` で小画面での横幅いっぱい

### 認証エラー
- `max-w-md` (Tailwind CSS) で中サイズまでの幅
- `w-full` で小画面での横幅いっぱい
- `p-4` で小画面でのパディング確保
