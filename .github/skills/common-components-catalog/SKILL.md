---
name: common-components-catalog
description: 共通コンポーネント一覧を提供するスキル。再利用可能なコンポーネントのカタログ。
---

# 共通コンポーネントカタログ スキル

## 概要

アプリ全体で再利用される共通コンポーネントのカタログです。Mantine UIベースで構築され、一貫性のあるUI/UXを提供します。

## メインソースファイル

### 共通コンポーネントディレクトリ
- `app/(core)/_components/`: すべての共通コンポーネントを配置

## 主要機能グループ

### 1. レイアウト関連
- PageHeader: ページヘッダー（Paper、プロフィールボタン自動表示）
- SideMenu: サイドメニュー（デスクトップ）
- BottomBar: フッター（モバイル）
- ScrollableTabs: スティッキータブコンポーネント

### 2. ナビゲーション関連
- NavigationFAB: ナビゲーション専用FAB（左下固定、右展開）
- SubMenuFAB: サブメニュー専用FAB（右下固定、上展開）
- NavigationButton: 画面遷移専用ボタン

### 3. ローディング関連
- LoadingContext: グローバルローディング状態管理
- LoadingIndicator: 画面左上のローディング表示
- LoadingButton: ローディング付きボタン
- ScreenWrapper: 画面遷移完了検知ラッパー

### 4. クエスト関連
- QuestCard: クエストカード
- QuestDetail: クエスト詳細表示
- QuestForm: クエストフォーム
- QuestStatusBadge: ステータスバッジ

### 5. フィルター・検索
- SearchBar: 検索バー
- FilterPopup: フィルタポップアップ
- SortPopup: ソートポップアップ

### 6. フィードバック
- LoadingSpinner: ローディングスピナー
- ErrorMessage: エラーメッセージ
- EmptyState: 空状態表示
- LikeButton: いいねボタン
- ReportButton: 完了報告ボタン

## Reference Files Usage

### 全コンポーネント一覧を確認する場合
レイアウト、タブ、クエスト、ボタン、ローディング、フィルター等のカテゴリ別一覧を確認：
```
references/component_list.md
```

### Props定義を確認する場合
各コンポーネントの型定義、Propsの詳細、命名規則を確認：
```
references/props_reference.md
```

### 使用ガイドラインを確認する場合
設計原則、コンポーネント選択ガイド、スタイリング、パフォーマンス、アクセシビリティを確認：
```
references/usage_guidelines.md
```

## クイックスタート

1. **コンポーネント探索**: `references/component_list.md` でカテゴリ別一覧確認
2. **Props確認**: `references/props_reference.md` で使用方法確認
3. **実装時**: `references/usage_guidelines.md` でベストプラクティス確認

## 実装上の注意点

### 必須パターン
- **配置場所**: すべて `app/(core)/_components/` に配置
- **Mantineベース**: Mantine UIコンポーネントを基本として使用
- **TypeScript厳格**: すべてのPropsに型定義必須、`any` 型禁止
- **再利用性**: 特定画面に依存しない汎用的な設計

### 主要コンポーネント

**PageHeader:**
- Paper + ボーダー + 影が自動適用
- プロフィールボタン自動表示（親：家族アイコン、子供：子供アイコン）
- 右側にアクション配置可能

**ScrollableTabs:**
- タブヘッダー固定（スティッキー）
- 横スクロール + スワイプ対応
- タブ変更時の自動スクロール

**NavigationFAB / SubMenuFAB:**
- 固定配置（左下 / 右下）
- 展開方向（右 / 上）
- アイコン指定（Apps / Menu）

**LoadingContext + LoadingIndicator:**
- グローバルローディング状態管理
- アプリ全体で共有
- 画面左上にフローティング表示

### 設計原則
- **単一責任**: 1つのコンポーネント = 1つの責任
- **関心の分離**: 表示とロジックを分離
- **Props命名**: `onClick`, `isLoading`, `leftSection` 等の規則に従う

### スタイリング
- Mantineテーマシステムを活用
- カラー、サイズ、スペーシングはMantine標準を使用
- レスポンシブデザイン対応（ブレークポイント: xs, sm, md, lg, xl）


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

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## 使用ガイドライン

### ページヘッダーの統一
すべての主要画面でPageHeaderを使用することで、UIの一貫性を保つ。プロフィールボタンがデフォルトで表示され、ユーザーエクスペリエンスを向上させる。

### ローディング管理の自動化
LoadingButton + ScreenWrapperの組み合わせで、画面遷移時のローディング管理を自動化する。

### FABの使い分け
- **NavigationFAB**: アプリ全体のナビゲーション
- **SubMenuFAB**: 画面固有のアクション（編集、削除、追加など）
- **FloatingActionButton**: カスタムな動作が必要な特殊ケースのみ
