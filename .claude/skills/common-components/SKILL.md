---
name: common-components
description: '共通UIコンポーネントのカタログを提供するスキル。PageHeader・ScrollableTabs・NavigationFAB・SubMenuFAB・LoadingButton・ScreenWrapperなどの使い方を含む。'
---

# 共通コンポーネントカタログ スキル

## 概要

全画面で共有して使用する共通UIコンポーネント群。`packages/web/app/(core)/_components/` に配置。

## コンポーネント一覧

### PageHeader
```
packages/web/app/(core)/_components/PageHeader.tsx
```
- ページ上部のヘッダー
- Props: `title`, `description`, `actions`（右側のボタン群）

### ScrollableTabs
```
packages/web/app/(core)/_components/ScrollableTabs.tsx
```
- 横スクロール可能なタブコンポーネント
- Props: `tabs`（TabConfig[]）, `value`, `onChange`
- タブ数が多い場合に自動スクロール

### NavigationFAB
```
packages/web/app/(core)/_components/NavigationFAB.tsx
```
- ナビゲーション用フローティングアクションボタン
- `FABContext` と連携して各画面からカスタマイズ

### SubMenuFAB
```
packages/web/app/(core)/_components/SubMenuFAB.tsx
```
- サブメニュー付きFAB
- Props: `actions`（ActionItem[]）, `icon`
- クリックでサブメニューが展開

```typescript
<SubMenuFAB
  actions={[
    { label: "編集", icon: <IconEdit />, onClick: handleEdit },
    { label: "削除", icon: <IconTrash />, onClick: handleDelete, danger: true }
  ]}
/>
```

### LoadingButton
```
packages/web/app/(core)/_components/LoadingButton.tsx
```
- ローディング状態付きボタン（画面遷移時）
- Props: `loading`, `onClick`, `children`
- ローディング中はスピナー表示・クリック無効

### NavigationButton
```
packages/web/app/(core)/_components/NavigationButton.tsx
```
- ページ遷移用ボタン（リンク付き）
- Props: `href`, `label`, `icon`

### ScreenWrapper
```
packages/web/app/(core)/_components/ScreenWrapper.tsx
```
- 全画面でラップするコンポーネント（**必須**）
- 適切なパディング・最大幅を自動設定
- `children` を受け取る

```typescript
// 全ての Screen コンポーネントで使用
const MyScreen = () => {
  return (
    <ScreenWrapper>
      {/* 画面コンテンツ */}
    </ScreenWrapper>
  )
}
```

## 実装上の注意点

- `ScreenWrapper` は全 Screen コンポーネントで必須
- `SubMenuFAB` と `NavigationFAB` は別物（役割が異なる）
- `LoadingButton` は Next.js の `useRouter().push()` と組み合わせて使用
- 独自のリスト UI を作成する前に既存コンポーネントを確認すること
