---
name: quest-edit-layout-usage
description: クエスト編集レイアウト使用方法を提供するスキル。Props定義、使用例を含む。
---

# クエスト編集レイアウト使用方法 スキル

## 概要

クエスト編集レイアウトの使用方法を説明するスキル。タイトル表示、タブベース編集フォーム、FAB対応を含む。

## Props定義

```typescript
type QuestEditLayoutProps<TForm extends Record<string, unknown>> = {
  /** クエストID（新規作成時はundefined） */
  questId?: string
  /** データ取得中のローディング状態 */
  isLoading: boolean
  /** フォーム送信時のハンドラ */
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  /** タブ設定 */
  tabs: TabConfig[]
  /** 編集モード時のアクションボタン */
  editActions: ReactNode[]
  /** 新規作成モード時のアクションボタン */
  createActions: ReactNode[]
  /** 編集モード時のFABアクション */
  fabEditActions?: FloatingActionItem[]
  /** 新規作成モード時のFABアクション */
  fabCreateActions?: FloatingActionItem[]
  /** フローティングポップアップコンポーネント */
  popups?: ReactNode
}

type TabConfig = {
  /** タブの値 */
  value: string
  /** タブのラベル */
  label: string
  /** エラーがあるか */
  hasErrors: boolean
  /** タブパネルの内容 */
  content: ReactNode
}
```

## 使用例

```typescript
<QuestEditLayout<FamilyQuestFormType>
  questId={familyQuestId}
  isLoading={questLoading}
  onSubmit={onSubmit}
  tabs={[
    {
      value: 'basic',
      label: '基本設定',
      hasErrors: hasBasicErrors,
      content: <BasicSettingsTab />
    },
    {
      value: 'details',
      label: '詳細設定',
      hasErrors: hasDetailErrors,
      content: <DetailSettingsTab />
    }
  ]}
  editActions={[
    <Button key="cancel" onClick={() => navigate(-1)}>キャンセル</Button>,
    <Button key="save" type="submit">更新</Button>
  ]}
  createActions={[
    <Button key="cancel" onClick={() => navigate(-1)}>キャンセル</Button>,
    <Button key="save" type="submit">登録</Button>
  ]}
  fabEditActions={[
    {
      icon: <IconDeviceFloppy size={20} />,
      label: "保存",
      onClick: () => onSubmit()
    }
  ]}
  fabCreateActions={[
    {
      icon: <IconDeviceFloppy size={20} />,
      label: "登録",
      onClick: () => onSubmit()
    }
  ]}
  popups={<SomeModalOrPopup />}
/>
```

## 主要機能

### タイトル表示
- `questId`の有無に応じて自動切り替え
- 編集時: "クエスト編集"
- 新規登録時: "クエスト登録"

### タブ管理
- `ScrollableTabs`コンポーネントを使用してタブ固定化
- タブヘッダーが画面上部にスティッキー（固定）
- 横スクロール対応（タブが多い場合）
- スワイプでのタブ切り替え対応
- タブごとにバリデーションエラー状態を表示
- エラーがある場合、タブにアラートアイコンを右側セクションに表示

### アクションボタン切り替え
- `questId`の有無に応じて、編集モード/新規作成モードのボタンを表示
- `editActions`: 編集モード時のアクションボタン
- `createActions`: 新規作成モード時のアクションボタン

### FAB対応
- FABアクションを設定可能
- モバイル時に適したUI

## 注意点

- タイトルは自動で切り替わるため、呼び出し側で設定不要
- フォームの処理は呼び出し側で実施
- レイアウトと見た目のみ提供
- タブは`ScrollableTabs`コンポーネントで固定化されている
- 詳細設定タブは自身でスクロール制御するため、`overflowY: hidden`が設定される
