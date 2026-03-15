(2026年3月記載)

# モジュール責務

## ローディング管理

画面遷移時のローディング状態をグローバルに管理する仕組みを提供する。

### LoadingContext
- **責務**: グローバルなローディング状態を管理する
- **提供**: `useLoadingContext()` フックを通じて状態とメソッドを提供
- **タイムアウト**: 3秒後に自動的にローディングを停止（安全装置）

### LoadingIndicator
- **責務**: 画面右上にローディングインジケーターを表示する
- **表示**: ローディング中のみ表示（フローティング表示、z-index: 9999）

### LoadingButton
- **責務**: クリック時に自動的にローディングを開始するボタン
- **制約**: ローディング中は押せないようにdisabledにする
- **Props**: `ignoreLoading` を指定するとローディング状態を無視できる

**使用例:**
```tsx
import { LoadingButton } from '@/app/(core)/_components/LoadingButton'
import { useRouter } from 'next/navigation'

const MyComponent = () => {
  const router = useRouter()
  
  return (
    <LoadingButton onClick={() => router.push('/quests')}>
      クエスト一覧へ
    </LoadingButton>
  )
}
```

### ScreenWrapper
- **責務**: 画面遷移完了を検知してローディングを停止する
- **必須**: すべてのXxxScreen.tsxで使用すること
- **仕組み**: コンポーネントマウント時に自動的に`stopLoading()`を呼び出す

**使用例:**
```tsx
import { ScreenWrapper } from '@/app/(core)/_components/ScreenWrapper'

export const FamilyQuestsScreen = () => {
  return (
    <ScreenWrapper>
      <div>画面内容</div>
    </ScreenWrapper>
  )
}
```

## ローディングフロー

1. ユーザーが`LoadingButton`をクリック
2. `startLoading()`が呼ばれ、画面右上にインジケーター表示
3. 画面遷移開始
4. 遷移先の`ScreenWrapper`がマウントされると`stopLoading()`が呼ばれる
5. 3秒経過しても停止されない場合は自動停止（タイムアウト）

## ファイル構成と責務

### フロントエンド

- **page.tsx**: ルーティング専用
- **XxxScreen.tsx**: 画面実装、ロジック呼び出し
- **XxxLayout.tsx**: プレゼンテーション層、データ表示専用
- **useXxx.ts**: APIアクセスロジック、React Query統合

### バックエンド

- **client.ts**: APIクライアント、型定義import
- **route.ts**: APIエンドポイント、リクエスト/レスポンス処理
- **service.ts**: ビジネスロジック、トランザクション処理
- **query.ts**: 読み取り専用クエリ、複雑なJOIN
- **db.ts**: 単一テーブル更新、排他制御
