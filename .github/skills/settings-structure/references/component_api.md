# 設定画面 コンポーネントAPI

(2026年3月記載)

## 概要

設定画面では、iPhone風のリストUIを実現するために`SettingsListItem`と`SettingsSection`という2つの再利用可能なコンポーネントを提供しています。

## SettingsListItem コンポーネント

### 概要

iPhone風の設定リストアイテムを表示するコンポーネント。3つのタイプ（button/switch/value）をサポートし、一貫したUIを提供します。

### Props 定義

```typescript
type SettingsListItemProps = {
  icon?: React.ReactNode;      // アイコン（Tablerアイコン推奨）
  label: string;                // メインラベル（必須）
  description?: string;         // 説明文（オプション）
  type: "button" | "switch" | "value";  // アイテムタイプ
  onClick?: () => void;         // クリックハンドラー（button型で使用）
  value?: boolean | string;     // 現在値（switch: boolean, value: string）
  onChange?: (value: boolean) => void;  // 変更ハンドラー（switch型で使用）
  showArrow?: boolean;          // 矢印アイコン表示（デフォルト: true）
  danger?: boolean;             // 危険な操作の赤色表示（デフォルト: false）
};
```

### タイプ別の使用例

#### 1. button タイプ

クリック可能な項目。詳細ページへの遷移などに使用。

```typescript
<SettingsListItem
  icon={<IconUser size={20} />}
  label="プロフィール"
  description="名前、アバター、自己紹介を編集"
  type="button"
  onClick={() => router.push(SETTINGS_URL.PROFILE)}
/>
```

**特徴:**
- 右端に矢印アイコン（`IconChevronRight`）を表示
- ホバー時に背景色が変化
- クリック可能なカーソルスタイル

#### 2. switch タイプ

トグルスイッチ付き項目。ON/OFF設定に使用。

```typescript
const [pushEnabled, setPushEnabled] = useState(true);

<SettingsListItem
  icon={<IconBell size={20} />}
  label="プッシュ通知"
  description="新しいクエストや完了通知を受け取る"
  type="switch"
  value={pushEnabled}
  onChange={setPushEnabled}
/>
```

**特徴:**
- 右端にMantineの`Switch`コンポーネントを表示
- スイッチ自体をクリックしてON/OFF切り替え
- `value`にboolean値、`onChange`にハンドラーを渡す

#### 3. value タイプ

現在の設定値を表示する項目。

```typescript
<SettingsListItem
  icon={<IconMail size={20} />}
  label="メールアドレス"
  type="value"
  value="user@example.com"
  onClick={() => router.push(SETTINGS_URL.EMAIL)}
/>
```

**特徴:**
- 右端に現在の値をグレー文字で表示
- 矢印アイコンも表示（`showArrow={false}`で非表示可能）
- クリック可能（`onClick`を渡した場合）

### danger プロパティ

危険な操作（削除、ログアウトなど）に使用。

```typescript
<SettingsListItem
  icon={<IconLogout size={20} />}
  label="ログアウト"
  type="button"
  onClick={handleLogout}
  danger
/>
```

**効果:**
- ラベルテキストが赤色（`text-red-600 dark:text-red-400`）に変更
- アイコンも赤色に変更

### スタイリング詳細

```typescript
// ベーススタイル
className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"

// ホバースタイル（button/value型）
className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"

// アイコン部分
<Box className="flex items-center gap-3 flex-1">
  {icon && <Box className="text-gray-600 dark:text-gray-400">{icon}</Box>}
  <Box>
    <Text className={`text-sm ${danger ? 'text-red-600 dark:text-red-400' : ''}`}>
      {label}
    </Text>
    {description && (
      <Text size="xs" className="text-gray-500 dark:text-gray-400">
        {description}
      </Text>
    )}
  </Box>
</Box>
```

## SettingsSection コンポーネント

### 概要

設定項目をカテゴリ別にグループ化するセクションコンポーネント。

### Props 定義

```typescript
type SettingsSectionProps = {
  title?: string;         // セクションタイトル（オプション）
  footer?: string;        // セクションフッター（補足説明、オプション）
  children: React.ReactNode;  // セクション内の子要素（リストアイテム）
};
```

### 使用例

```typescript
<SettingsSection
  title="アカウント設定"
  footer="プロフィール情報やメールアドレス、パスワードを管理します。"
>
  <SettingsListItem
    icon={<IconUser size={20} />}
    label="プロフィール"
    type="button"
    onClick={() => router.push(SETTINGS_URL.PROFILE)}
  />
  <SettingsListItem
    icon={<IconMail size={20} />}
    label="メールアドレス"
    type="value"
    value="user@example.com"
    onClick={() => router.push(SETTINGS_URL.EMAIL)}
  />
  <SettingsListItem
    icon={<IconLock size={20} />}
    label="パスワード"
    type="button"
    onClick={() => router.push(SETTINGS_URL.PASSWORD)}
  />
</SettingsSection>
```

### スタイリング詳細

```typescript
<Box className="mb-6">
  {/* タイトル */}
  {title && (
    <Text size="xs" fw={600} className="px-4 py-2 text-gray-600 dark:text-gray-400 uppercase">
      {title}
    </Text>
  )}
  
  {/* リストアイテム群 */}
  <Paper
    radius="md"
    className="overflow-hidden border border-gray-200 dark:border-gray-700"
  >
    {children}
  </Paper>
  
  {/* フッター */}
  {footer && (
    <Text size="xs" className="px-4 py-2 text-gray-500 dark:text-gray-400">
      {footer}
    </Text>
  )}
</Box>
```

**特徴:**
- `Paper`コンポーネントで子要素を囲み、角丸とボーダーを適用
- `overflow-hidden`で角丸内にリストアイテムを収める
- タイトルはグレー、大文字、小さいフォントサイズ
- フッターはグレー、小さいフォントサイズ

## SettingsList コンポーネント

### 概要

設定一覧全体を管理するコンポーネント。カテゴリ別にセクションを配置。

### Props 定義

```typescript
type SettingsListProps = {
  selectedSetting: string | null;  // 現在選択中の設定（ハイライト用）
};
```

### 使用例

```typescript
<SettingsList selectedSetting="profile" />
```

### 実装構造

```typescript
export default function SettingsList({ selectedSetting }: SettingsListProps) {
  const router = useRouter();

  return (
    <Stack gap="md" className="p-4">
      {/* アカウント設定セクション */}
      <SettingsSection title="アカウント設定">
        <SettingsListItem
          icon={<IconUser size={20} />}
          label="プロフィール"
          type="button"
          onClick={() => router.push(SETTINGS_URL.PROFILE)}
        />
        {/* ... */}
      </SettingsSection>

      {/* 通知設定セクション */}
      <SettingsSection title="通知設定">
        <SettingsListItem
          icon={<IconBell size={20} />}
          label="通知"
          type="button"
          onClick={() => router.push(SETTINGS_URL.NOTIFICATIONS)}
        />
      </SettingsSection>

      {/* プライバシー設定セクション */}
      <SettingsSection title="プライバシー設定">
        <SettingsListItem
          icon={<IconLock size={20} />}
          label="プライバシー"
          type="button"
          onClick={() => router.push(SETTINGS_URL.PRIVACY)}
        />
      </SettingsSection>

      {/* アプリ情報セクション */}
      <SettingsSection title="アプリ情報">
        <SettingsListItem
          icon={<IconInfoCircle size={20} />}
          label="アプリについて"
          type="button"
          onClick={() => router.push(SETTINGS_URL.ABOUT)}
        />
      </SettingsSection>
    </Stack>
  );
}
```

## 推奨アイコン

| 設定項目 | Tablerアイコン |
|---------|---------------|
| プロフィール | `IconUser` |
| メールアドレス | `IconMail` |
| パスワード | `IconLock` |
| 通知 | `IconBell` |
| プライバシー | `IconShield` |
| セキュリティ | `IconLock` |
| アプリについて | `IconInfoCircle` |
| 利用規約 | `IconFileText` |
| プライバシーポリシー | `IconShieldCheck` |
| ログアウト | `IconLogout` |

## ベストプラクティス

### ✅ DO
- `SettingsSection`で関連する設定項目をグループ化
- `type`に応じた適切なPropsを渡す（button: onClick, switch: value+onChange）
- 危険な操作には`danger`プロパティを使用
- アイコンサイズは20pxに統一

### ❌ DON'T
- `SettingsListItem`を独自スタイルで上書きしない（一貫性維持）
- `danger`を通常の設定項目に使用しない（赤色は危険な操作のみ）
- `showArrow={false}`を多用しない（iPhone UIの一貫性のため）
- descriptionが長すぎる場合は省略する（2行以内推奨）

## TypeScript型定義例

```typescript
// packages/web/app/(app)/settings/_components/SettingsListItem.tsx
import { ReactNode } from "react";

export type SettingsListItemType = "button" | "switch" | "value";

export interface SettingsListItemProps {
  icon?: ReactNode;
  label: string;
  description?: string;
  type: SettingsListItemType;
  onClick?: () => void;
  value?: boolean | string;
  onChange?: (value: boolean) => void;
  showArrow?: boolean;
  danger?: boolean;
}

export interface SettingsSectionProps {
  title?: string;
  footer?: string;
  children: ReactNode;
}
```
