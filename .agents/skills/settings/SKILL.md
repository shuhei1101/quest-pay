---
name: settings
description: '設定画面の知識を提供するスキル。iPhone風リスト形式・2ペイン構成・設定項目コンポーネント（SettingsListItem）の使い方を含む。'
---

# 設定画面 スキル

## 概要

設定画面のレイアウト・コンポーネント構造。iPhone風のリスト形式と PC の2ペイン構成を提供する。

## メインソースファイル

- `packages/web/app/(app)/settings/layout.tsx`: 2ペインレスポンシブレイアウト
- `packages/web/app/(app)/settings/page.tsx`: 設定ルートページ（リダイレクト）
- `packages/web/app/(app)/settings/_components/SettingsList.tsx`: 設定一覧（カテゴリ別）
- `packages/web/app/(app)/settings/_components/SettingsListItem.tsx`: iPhone風リストアイテム
- `packages/web/app/(app)/settings/profile/page.tsx`: プロフィール設定
- `packages/web/app/(app)/settings/notifications/page.tsx`: 通知設定
- `packages/web/app/(app)/settings/privacy/page.tsx`: プライバシー設定
- `packages/web/app/(app)/settings/about/page.tsx`: アプリ情報

## 2ペインレイアウト

- **PC**: 左に設定一覧（w-1/3）、右に詳細（flex-1）
- **モバイル**: 一覧のみ → 選択時に詳細へ遷移
- `useWindow` + `isTablet` で判定

## SettingsListItem コンポーネント

3タイプをサポート:

```typescript
// button型（クリック可能・矢印アイコン付き）
<SettingsListItem
  icon={<IconUser size={20} />}
  label="プロフィール"
  description="名前・アイコンを変更"
  type="button"
  onClick={() => router.push(SETTINGS_URL.profile)}
/>

// switch型（トグルスイッチ）
<SettingsListItem
  icon={<IconBell size={20} />}
  label="プッシュ通知"
  type="switch"
  value={pushEnabled}
  onChange={setPushEnabled}
/>

// value型（現在値表示）
<SettingsListItem
  icon={<IconLanguage size={20} />}
  label="言語"
  type="value"
  value="日本語"
/>

// danger（赤色表示・削除/ログアウト用）
<SettingsListItem
  label="ログアウト"
  type="button"
  onClick={handleLogout}
  danger={true}
/>
```

## SettingsSection コンポーネント

```typescript
<SettingsSection title="アカウント" footer="アカウント情報を管理します">
  <SettingsListItem ... />
  <SettingsListItem ... />
</SettingsSection>
```

## 設定カテゴリ

- **アカウント設定**: プロフィール・メールアドレス・パスワード
- **通知設定**: プッシュ通知・メール通知・クエスト関連通知
- **プライバシー設定**: 公開範囲・アクティビティ共有・データ共有
- **アプリ情報**: バージョン・技術スタック・利用規約

## 実装上の注意点

- 独自のリストUIを実装せず、必ず `SettingsListItem` を使用
- `danger` プロパティは削除・ログアウトのみに使用
- 設定URLは `SETTINGS_URL` オブジェクトで管理
