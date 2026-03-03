---
name: quest-view-structure
description: クエスト閲覧画面の構造知識を提供するスキル。共通コンポーネント、各クエストタイプの閲覧画面構造を含む。
---

# quest-view-structure

このスキルは、クエスト閲覧画面（QuestView）の構造に関する知識を提供する。すべてのクエストタイプ（家族、公開、テンプレート、子供）の閲覧画面で共通使用される再利用可能なコンポーネント群と、各画面固有の構造を網羅する。

## 対象範囲

- 共通コンポーネント (`app/(app)/quests/view/_components/`)
- 家族クエスト閲覧画面 (`app/(app)/quests/family/[id]/view/`)
- 公開クエスト閲覧画面 (`app/(app)/quests/public/[id]/view/`)
- テンプレートクエスト閲覧画面 (`app/(app)/quests/template/[id]/view/`)
- 子供クエスト閲覧画面 (`app/(app)/quests/family/[id]/view/child/[childId]/`)

## 共通コンポーネント

### 1. QuestViewHeader

**パス:** `app/(app)/quests/view/_components/QuestViewHeader.tsx`

**役割:** クエスト名を表示する共通ヘッダー

**Props:**
- `questName: string` - クエスト名
- `headerColor?: { light: string, dark: string }` - ヘッダーの背景色（任意、デフォルトはblue）

### 2. QuestViewIcon

**パス:** `app/(app)/quests/view/_components/QuestViewIcon.tsx`

**役割:** クエストアイコンを表示する

**Props:**
- `iconName?: string` - アイコン名
- `iconSize?: number` - アイコンサイズ
- `iconColor?: string` - アイコン色

### 3. QuestConditionTab

**パス:** `app/(app)/quests/view/_components/QuestConditionTab.tsx`

**役割:** クエスト条件タブ（レベル、カテゴリ、達成条件、報酬、経験値、必要完了回数）

**主要Props:**
- `level: number` - クエストレベル
- `maxLevel?: number` - 最大レベル（デフォルト5）
- `category: string` - カテゴリ名
- `successCondition: string` - 達成条件
- `requiredCompletionCount: number` - 必要完了回数
- `currentCompletionCount?: number` - 現在の完了回数（進捗表示用）
- `reward: number` - 報酬額
- `exp: number` - 獲得経験値
- `type?: "parent" | "child" | "online"` - クエストタイプ
- `currentClearCount?: number` - 現在のクリア回数（レベルアップ用）
- `requiredClearCount?: number` - 次レベルまでの必要クリア回数
- `iconName?: string` - アイコン名
- `iconSize?: number` - アイコンサイズ
- `iconColor?: string` - アイコン色

### 4. QuestDetailTab

**パス:** `app/(app)/quests/view/_components/QuestDetailTab.tsx`

**役割:** 依頼情報タブ（依頼主、依頼内容）

**Props:**
- `client: string` - 依頼主
- `requestDetail: string` - 依頼内容

### 5. QuestOtherTab

**パス:** `app/(app)/quests/view/_components/QuestOtherTab.tsx`

**役割:** その他情報タブ（タグ、推奨年齢・月齢）

**Props:**
- `tags: string[]` - タグリスト
- `ageFrom?: number | null` - 推奨年齢（開始）
- `ageTo?: number | null` - 推奨年齢（終了）
- `monthFrom?: number | null` - 推奨月齢（開始）
- `monthTo?: number | null` - 推奨月齢（終了）

### 6. ChildQuestViewFooter（共通）

**パス:** `app/(app)/quests/view/_components/ChildQuestViewFooter.tsx`

**役割:** 子供用クエスト閲覧フッター（戻る、完了報告、報告取消）

**主要機能:**
- 戻るボタン
- 完了報告ボタン（disabled/enabledの制御）
- 完了報告取消ボタン（pending_reviewの場合のみ表示）

## 家族クエスト閲覧画面

### ファイル構成

```
app/(app)/quests/family/[id]/view/
  ├── page.tsx                           # ページエントリーポイント
  ├── FamilyQuestViewScreen.tsx          # メイン画面コンポーネント
  ├── _components/
  │   ├── FamilyQuestViewLayout.tsx      # レイアウトコンポーネント
  │   └── ParentQuestViewFooter.tsx      # 親用フッター
  └── _hooks/
      └── useFamilyQuest.ts              # クエストデータ取得フック
```

### FamilyQuestViewScreen

**役割:** 家族クエスト閲覧のメイン画面

**主要機能:**
- レベル選択（複数レベルがある場合）
- 選択レベルに応じた詳細表示
- 編集モーダル呼び出し
- 編集権限制御（親のみ）

**状態管理:**
- `selectedLevel: number` - 選択中のレベル
- `editModalOpened: boolean` - 編集モーダル開閉状態

### FamilyQuestViewLayout

**役割:** 家族クエスト閲覧のレイアウト

**Props:**
- クエスト基本情報（name, backgroundColor, icon情報）
- 表示データ（level, category, successCondition, reward, exp, requiredCompletionCount）
- 詳細情報（client, requestDetail, tags, age/month範囲）
- `footer?: ReactNode` - フッターコンポーネント

**構成:**
- QuestViewHeader（ヘッダー）
- Tabs（タブ切り替え）
  - 条件タブ（QuestConditionTab）
  - 依頼情報タブ（QuestDetailTab）
  - その他タブ（QuestOtherTab）
- Footer（ParentQuestViewFooter）

### ParentQuestViewFooter

**役割:** 親用フッター（編集ボタンのみ）

**Props:**
- `onEdit: () => void` - 編集ボタン押下時のハンドラー

## 公開クエスト閲覧画面

### ファイル構成

```
app/(app)/quests/public/[id]/view/
  ├── page.tsx                           # ページエントリーポイント
  ├── PublicQuestView.tsx                # メイン画面コンポーネント
  ├── _components/
  │   ├── PublicQuestViewLayout.tsx      # レイアウトコンポーネント
  │   └── PublicQuestViewFooter.tsx      # フッター（未使用？）
  └── _hooks/
      ├── usePublicQuest.ts              # クエストデータ取得フック
      ├── useLikeQuest.ts                # いいね機能フック
      ├── useLikeCount.ts                # いいね数取得フック
      ├── useIsLike.ts                   # いいね状態取得フック
      └── useCancelQuestLike.ts          # いいね解除フック
```

### PublicQuestView

**役割:** 公開クエスト閲覧のメイン画面

**主要機能:**
- レベル選択（複数レベルがある場合、レベル選択メニュー）
- いいね機能（いいね/いいね解除、いいね数表示）
- コメント機能（コメントモーダル呼び出し、コメント数表示）
- 家族情報表示
- 編集機能（編集権限がある場合のみ）
- FAB（Floating Action Button）によるアクション提供

**状態管理:**
- `selectedLevel: number` - 選択中のレベル
- `levelMenuOpened: boolean` - レベル選択メニュー開閉状態
- `editModalOpened: boolean` - 編集モーダル開閉状態
- `commentModalOpened: boolean` - コメントモーダル開閉状態

**編集権限チェック:**
- `publicQuest?.base.familyId === userInfo?.profiles?.familyId`

### PublicQuestViewLayout

**役割:** 公開クエスト閲覧のレイアウト

**Props:** FamilyQuestViewLayoutと同様

**特徴:** 青系の配色（デフォルト: rgba(191, 219, 254, 0.5) / rgba(59, 130, 246, 0.2)）

## テンプレートクエスト閲覧画面

### ファイル構成

```
app/(app)/quests/template/[id]/view/
  ├── page.tsx                           # ページエントリーポイント
  ├── TemplateQuestViewScreen.tsx        # メイン画面コンポーネント
  ├── _components/
  │   ├── TemplateQuestViewLayout.tsx    # レイアウトコンポーネント
  │   └── TemplateQuestViewFooter.tsx    # フッター
  └── _hooks/
      └── useTemplateQuest.ts            # クエストデータ取得フック
```

### TemplateQuestViewScreen

**役割:** テンプレートクエスト閲覧のメイン画面

**主要機能:**
- レベル選択（複数レベルがある場合）
- 家族クエストとして採用機能

**状態管理:**
- `selectedLevel: number` - 選択中のレベル

### TemplateQuestViewLayout

**役割:** テンプレートクエスト閲覧のレイアウト

**Props:** FamilyQuestViewLayoutと同様

**特徴:** 黄色系の配色（デフォルト: rgba(255, 237, 213, 0.5) / rgba(255, 159, 0, 0.2)）

### TemplateQuestViewFooter

**役割:** テンプレートクエスト用フッター（家族クエストとして採用ボタン）

**Props:**
- `onAdopt: () => void` - 採用ボタン押下時のハンドラー

## 子供クエスト閲覧画面

### ファイル構成

```
app/(app)/quests/family/[id]/view/child/[childId]/
  ├── page.tsx                           # ページエントリーポイント
  ├── ChildQuestViewScreen.tsx           # メイン画面コンポーネント
  ├── _components/
  │   ├── ChildQuestViewLayout.tsx       # レイアウトコンポーネント
  │   ├── ChildQuestViewFooter.tsx       # 子供用フッター
  │   ├── ParentChildQuestViewFooter.tsx # 親用フッター
  │   ├── ReviewRequestModal.tsx         # 完了報告モーダル（子供用）
  │   ├── CancelReviewModal.tsx          # 報告取消モーダル（子供用）
  │   └── ReportReviewModal.tsx          # 報告内容確認モーダル（親用）
  └── _hooks/
      ├── useChildQuest.ts               # クエストデータ取得フック
      ├── useReviewRequest.ts            # 完了報告フック
      ├── useCancelReview.ts             # 報告取消フック
      ├── useRejectReport.ts             # 報告却下フック
      ├── useApproveReport.ts            # 報告承認フック
      └── useDeleteChildQuest.ts         # クエスト削除フック
```

### ChildQuestViewScreen

**役割:** 子供クエスト閲覧のメイン画面（子供/親両方が使用）

**主要機能:**
- ユーザータイプ別のフッター表示切り替え
  - 親: ParentChildQuestViewFooter（報告確認、編集、リセット）
  - 子供: ChildQuestViewFooter（戻る、完了報告、報告取消）
- 完了報告機能（子供用）
- 報告取消機能（子供用）
- 報告承認/却下機能（親用）
- クエスト削除（親用）

**モーダル:**
- ReviewRequestModal - 完了報告モーダル（子供用）
- CancelReviewModal - 報告取消モーダル（子供用）
- ReportReviewModal - 報告内容確認モーダル（親用、承認/却下）

### ChildQuestViewLayout

**役割:** 子供クエスト閲覧のレイアウト

**Props:** FamilyQuestViewLayoutと同様 + `footer?: ReactNode`

**特徴:** ブラウン系の配色（デフォルト: rgba(120, 53, 15, 0.2) / rgba(255, 255, 255, 0.2)）

### ParentChildQuestViewFooter

**役割:** 親用フッター（子供クエスト管理用）

**Props:**
- `isPendingReview: boolean` - 報告待ち状態かどうか
- `onReviewReport: () => void` - 報告確認ボタン押下時のハンドラー
- `onEdit: () => void` - 編集ボタン押下時のハンドラー（家族クエスト閲覧に遷移）
- `onReset: () => void` - リセットボタン押下時のハンドラー

## 共通の設計パターン

### レイアウトコンポーネントの責務
- データ表示のみに専念
- API呼び出しは行わない
- Propsで受け取ったデータを整形して表示
- 共通コンポーネント（QuestViewHeader、タブ系）を組み合わせて構成

### 画面コンポーネント（Screen）の責務
- データ取得（フック使用）
- 状態管理（レベル選択、モーダル開閉など）
- イベントハンドラーの実装
- レイアウトコンポーネントへのProps受け渡し
- 権限制御ロジック

### レベル選択機能
- 複数レベルがある場合のみ有効化
- `selectedLevel`状態で管理
- `availableLevels = details.map(d => d.level).filter(非null)`で利用可能レベルを取得
- `selectedDetail = details.find(d => d.level === selectedLevel) || details[0]`で選択中の詳細を取得

### 配色パターン
- 家族クエスト: ブラウン系 `rgba(120, 53, 15, 0.2)` / `rgba(255, 255, 255, 0.2)`
- 公開クエスト: 青系 `rgba(191, 219, 254, 0.5)` / `rgba(59, 130, 246, 0.2)`
- テンプレートクエスト: 黄色系 `rgba(255, 237, 213, 0.5)` / `rgba(255, 159, 0, 0.2)`
- 子供クエスト: ブラウン系 `rgba(120, 53, 15, 0.2)` / `rgba(255, 255, 255, 0.2)`（家族クエストと同じ）
