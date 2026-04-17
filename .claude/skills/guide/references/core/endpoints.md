
# エンドポイント定義 スキル

## 概要

全URL定数は `packages/web/app/(core)/endpoints.ts` に集約管理。ハードコードされたURLを使わず、必ずこのファイルの定数を使用する。

## メインファイル

```
packages/web/app/(core)/endpoints.ts
```

## URL定義パターン

### 静的URL
```typescript
export const HOME_URL = "/home"
export const FAMILIES_URL = "/families"
export const NOTIFICATIONS_URL = "/notifications"
```

### 動的URL（IDを含む場合）
```typescript
// 関数として定義
export const FAMILY_URL = (id: string) => `/families/${id}`
export const FAMILY_VIEW_URL = (id: string) => `/families/${id}/view`
export const QUEST_URL = (id: string) => `/quests/family/${id}`
```

### テスト画面URL
```typescript
export const TEST_URL = "/test"
export const TEST_MOCK_NAME_URL = `${TEST_URL}/mock-name`
```

### 設定画面URL（ネストされたURL）
```typescript
export const SETTINGS_URL = {
  root: "/settings",
  profile: "/settings/profile",
  notifications: "/settings/notifications",
  privacy: "/settings/privacy",
  about: "/settings/about"
}
```

## 使用方法

```typescript
import { FAMILY_URL, HOME_URL } from "@/app/(core)/endpoints"

// 使用例
router.push(HOME_URL)
router.push(FAMILY_URL(familyId))
```

## 新規URLの追加ルール

1. **命名規則**: `<FEATURE>_URL` または `<FEATURE>_<ACTION>_URL`
2. **動的パラメータ**: ID を含む場合は関数形式
3. **ネスト**: 同一機能の URL が多い場合はオブジェクトにまとめる
4. **ハードコード禁止**: コンポーネント内に直接 URL 文字列を書かない

```typescript
// ❌ NG - ハードコード
router.push("/families/123/view")

// ✅ OK - 定数使用
router.push(FAMILY_VIEW_URL(familyId))
```
