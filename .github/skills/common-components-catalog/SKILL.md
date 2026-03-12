---
name: common-components-catalog
description: 共通コンポーネント一覧を提供するスキル。再利用可能なコンポーネントのカタログ。
---

# 共通コンポーネントカタログ スキル

## 概要

共通コンポーネントカタログは、アプリ全体で再利用されるコンポーネントの一覧。

## ファイル構成

### 共通コンポーネント
- `app/(core)/_components/`: 共通コンポーネントディレクトリ

## 主要コンポーネント一覧

### レイアウト関連
- SideMenu: サイドメニュー
- BottomBar: フッター（モバイル）
- NavigationItem: ナビゲーションアイテム
- UserInfo: ユーザー情報表示
- PageHeader: ページヘッダー（Paperでラップ、ボーダー・影付き、右側にアクション配置可能、プロフィールボタン自動表示）

### タブ関連
- ScrollableTabs: スクロール可能なスティッキータブコンポーネント（タブヘッダー固定、横スクロール対応、スワイプ対応）

### クエスト関連
- QuestCard: クエストカード
- QuestDetail: クエスト詳細表示
- QuestForm: クエストフォーム
- QuestStatusBadge: ステータスバッジ

### ボタン関連
- FloatingActionButton: フローティングアクションボタン（基底コンポーネント）
- NavigationFAB: ナビゲーション専用FAB（左下固定、右展開、Appsアイコン）
- SubMenuFAB: サブメニュー専用FAB（右下固定、上展開、Menuアイコン）
- NavigationButton: 画面遷移専用ボタン（クリック時にローディング開始＋router.push実行）
- LoadingButton: ローディング付きボタン（クリック時に自動ローディング開始、ローディング中はdisabled）
- LikeButton: いいねボタン
- ReportButton: 完了報告ボタン

### ローディング関連
- LoadingContext: グローバルローディング状態管理
- LoadingIndicator: 画面左上のローディング表示（フローティング）
- NavigationButton: 画面遷移専用ボタン
- LoadingButton: ローディング付きボタン
- ScreenWrapper: 画面遷移完了検知ラッパー

### フィルター・検索
- SearchBar: 検索バー
- FilterPopup: フィルタポップアップ
- SortPopup: ソートポップアップ

### その他
- LoadingSpinner: ローディング表示
- ErrorMessage: エラーメッセージ
- EmptyState: 空状態表示

## 注意点

- すべての共通コンポーネントは`app/(core)/_components/`に配置
- Mantine UIを基本コンポーネントとして使用
- 再利用性を考慮した設計

## コンポーネント詳細

### PageHeader
**パス:** `app/(core)/_components/PageHeader.tsx`
**用途:** 各画面のページヘッダーを統一的に表示

**特徴:**
- Paperコンポーネントでラップされ、ボーダーと影が自動的に付く
- 右側にアクションボタンやその他の要素を配置可能
- マージンボトム（mb="md"）が自動的に設定される
- プロフィールアイコンボタンが自動的に表示される（丸枠でアイコン表示）
  - 親の場合：家族のアイコンを表示し、クリックで家族プロフィール画面へ遷移
  - 子供の場合：子供のアイコンを表示し、クリックで子供プロフィール画面へ遷移
- プロフィールボタンはshowProfileButtonプロップで表示/非表示の制御が可能

**使用例:**
```typescript
// 基本的な使用（プロフィールアイコンボタンが自動表示される）
<PageHeader title="タイムライン" />

// プロフィールボタンを非表示にする
<PageHeader title="タイムライン" showProfileButton={false} />

// 右側にボタンを配置（プロフィールアイコンボタンと併用可能）
<PageHeader 
  title="定額報酬"
  rightSection={
    <Button 
      leftSection={<IconEdit size={16} />} 
      onClick={() => router.push('/edit')}
    >
      編集
    </Button>
  }
/>
```

**適用画面:**
- タイムライン画面
- 報酬編集画面
- 報酬閲覧画面
- お小遣い管理画面
- 家族クエスト一覧画面
- 子供クエスト一覧画面
- ゲストクエスト一覧画面

### ScrollableTabs
**パス:** `app/(core)/_components/ScrollableTabs.tsx`
**用途:** タブベースのUIでタブヘッダーを上部に固定し、スクロール可能なタブを提供

**特徴:**
- タブヘッダーがスティッキー（画面上部に固定）
- 横スクロール対応（タブが多い場合）
- マウスホイールでの横スクロール
- 左右スワイプでのタブ切り替え対応
  - スワイプ判定距離: 50ピクセル
  - スワイプ継続時間: 500ミリ秒以内
  - 縦スクロールとの共存（touchAction: "pan-y"）
- タブ変更時の自動スクロール（選択タブが常に画面内に表示される）
- ダークモード対応
- スワイプエリアがフル高さで確実にタッチ検出

**Props:**
```typescript
type ScrollableTabItem = {
  value: string
  label: ReactNode
  leftSection?: ReactNode
  rightSection?: ReactNode
}

{
  activeTab: string | null
  onChange: (value: string | null) => void
  tabs: ScrollableTabItem[]
  children: ReactNode  // タブパネルの内容
}
```

**使用例:**
```typescript
<ScrollableTabs 
  activeTab={activeTab} 
  onChange={setActiveTab}
  tabs={[
    {
      value: "1",
      label: "レベル1",
      rightSection: <IconCheck size={16} />
    },
    {
      value: "2",
      label: "レベル2"
    }
  ]}
>
  <Tabs.Panel value="1">レベル1の内容</Tabs.Panel>
  <Tabs.Panel value="2">レベル2の内容</Tabs.Panel>
</ScrollableTabs>
```

**適用箇所:**
- クエスト編集レイアウト（QuestEditLayout）
- 詳細設定タブ（DetailSettings）

### FloatingActionButton関連

#### NavigationFAB
**パス:** `app/(core)/_components/NavigationFAB.tsx`
**用途:** アプリ全体のナビゲーションメニュー

**特徴:**
- 左下に固定配置
- 右方向に展開
- Appsアイコン（IconApps）をメイン表示
- アクティブな項目をハイライト表示可能

#### SubMenuFAB
**パス:** `app/(core)/_components/SubMenuFAB.tsx`
**用途:** 画面固有のサブメニュー（編集、削除、追加など）

**特徴:**
- 右下に固定配置
- 上方向に展開
- Menuアイコン（IconMenu）をメイン表示

#### FloatingActionButton
**パス:** `app/(core)/_components/FloatingActionButton.tsx`
**用途:** カスタムFAB動作が必要な場合の基底コンポーネント

**注意:** NavigationFABやSubMenuFABでカバーできない場合のみ使用

### ローディング関連

#### NavigationButton
**パス:** `app/(core)/_components/NavigationButton.tsx`
**用途:** 画面遷移時に自動的にローディング状態を管理するボタン

**特徴:**
- クリック時に自動的にstartLoading()を実行
- useRouter().push()で画面遷移
- ローディング中は自動的にdisabledになる
- 遷移先のScreenWrapperで自動的に停止

**使用例:**
```typescript
<NavigationButton href="/quests/123">
  クエスト詳細を見る
</NavigationButton>

// Mantineのボタンプロパティも使用可能
<NavigationButton 
  href="/families/456/edit"
  variant="outline"
  leftSection={<IconEdit size={16} />}
>
  編集
</NavigationButton>
```

#### LoadingButton
**パス:** `app/(core)/_components/LoadingButton.tsx`
**用途:** API呼び出しなど非同期処理時のローディング状態を管理するボタン

**特徴:**
- クリック時に自動的にstartLoading()を実行
- onClickハンドラーを自分で定義
- ローディング中は自動的にdisabledになる
- ローディング停止は手動で実行

**使用例:**
```typescript
const handleSubmit = async () => {
  try {
    await submitForm()
  } finally {
    stopLoading()
  }
}

<LoadingButton onClick={handleSubmit}>
  送信
</LoadingButton>
```

**NavigationButtonとの使い分け:**
- **NavigationButton**: 画面遷移時に使用（hrefを指定）
- **LoadingButton**: API呼び出しなど非遷移処理時に使用（onClickを定義）

#### LoadingContext
**パス:** `app/(core)/_components/LoadingContext.tsx`
**用途:** グローバルローディング状態の管理

#### LoadingIndicator
**パス:** `app/(core)/_components/LoadingIndicator.tsx`
**用途:** 画面左上にフローティング表示されるローディングインジケーター

#### ScreenWrapper
**パス:** `app/(core)/_components/ScreenWrapper.tsx`
**用途:** 画面遷移完了を検知してローディングを停止

**注意:** すべての`XxxScreen.tsx`で使用すること

## 使用ガイドライン

### ページヘッダーの統一
すべての主要画面でPageHeaderを使用することで、UIの一貫性を保つ。プロフィールボタンがデフォルトで表示され、ユーザーエクスペリエンスを向上させる。

### ローディング管理の自動化
LoadingButton + ScreenWrapperの組み合わせで、画面遷移時のローディング管理を自動化する。

### FABの使い分け
- **NavigationFAB**: アプリ全体のナビゲーション
- **SubMenuFAB**: 画面固有のアクション（編集、削除、追加など）
- **FloatingActionButton**: カスタムな動作が必要な特殊ケースのみ
