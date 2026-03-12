---
name: mock-creator
description: このスキルはモック画面作成依頼を受けて `/packages/web/app/test` 配下にモック画面を作成し、サイドメニューに自動的にリンクを追加する。UI/UXの検証、プロトタイピング、テスト画面の作成時に使用すべきスキル。
---

# Mock Creator

## Overview

このスキルは、お小遣いクエストボードプロジェクトのモック画面作成を効率化する。ユーザーからモック画面作成依頼を受けると、`/packages/web/app/test` 配下にモック画面を作成し、サイドメニューのモックセクションに自動的にリンクを追加する。

## When to Use

次の場合にこのスキルを使用する：

- ユーザーがモック画面の作成を依頼した時
- UI/UXの検証やプロトタイピングが必要な時
- コンポーネントの動作確認用テストページが必要な時
- 既存機能の改善案をビジュアルで確認したい時

## Workflow

### Step 1: Requirements Gathering

ユーザーからモック画面作成依頼を受けたら、以下を確認する：

1. **モック画面の目的**: 何を検証・確認したいのか
2. **画面名**: モック画面のディレクトリ名（例: `button-test-mock`, `layout-experiment-mock`）
3. **必要なコンポーネント**: 既存コンポーネントを使用するか、新規作成するか
4. **表示内容**: どのような内容を表示するか

ユーザーが「内部の構造は何でもいい」と言う場合は、シンプルな構成で作成する。

### Step 2: Create Mock Page

モック画面を以下の手順で作成する：

1. `/home/shuhei2441/repo/quest-pay/packages/web/app/test/<mock-name>/page.tsx` を作成
2. 基本的なNext.js Page構造を実装：
   ```tsx
   "use client"

   export default function <MockName>Page() {
     return (
       <div className="p-4">
         <h1 className="text-2xl font-bold mb-4"><Mock Title></h1>
         {/* モック内容 */}
       </div>
     )
   }
   ```
3. 必要に応じて追加のコンポーネントやロジックを実装

### Step 3: Update Endpoints

`/home/shuhei2441/repo/quest-pay/packages/web/app/(core)/endpoints.ts` にモック画面のURL定義を追加する：

```typescript
// 既存のテスト用URL定義の後に追加
export const TEST_<MOCK_NAME>_URL = `${TEST_URL}/<mock-name>`
```

### Step 4: Update Side Menu

`/home/shuhei2441/repo/quest-pay/packages/web/app/(app)/_components/SideMenu.tsx` を更新：

1. **インポート文を更新**:
   ```typescript
   import { ..., TEST_<MOCK_NAME>_URL } from '@/app/(core)/endpoints'
   ```

2. **モックセクションにNavLinkを追加**:
   ```tsx
   {/* モック（開発・デバッグ用） */}
   <NavLink
     className='side-nav'
     href="#required-for-focus"
     label="モック"
     leftSection={<IconSettings color={menuColors.settings} size={18} stroke={1.2} />}
     childrenOffset={28}
   >
     {/* 既存のモック画面リンク */}
     ...
     {/* 新規モック画面リンク */}
     <NavLink
       className='side-nav'
       href={`${TEST_<MOCK_NAME>_URL}`}
       label="<表示名>"
       leftSection={<IconSettings color={menuColors.settings} size={18} stroke={1.2} />}
     />
   </NavLink>
   ```

### Step 5: Verify

作成したモック画面を確認：

1. サイドメニューのモックセクションに新しいリンクが表示されることを確認
2. リンクをクリックして画面が正常に表示されることを確認

## Best Practices

- **命名規則**: モック画面のディレクトリ名は `<purpose>-mock` の形式を推奨（例: `button-test-mock`, `layout-experiment-mock`）
- **シンプルさ優先**: モック画面は検証目的に徹し、不要な複雑さは避ける
- **既存コンポーネント活用**: 既存の共通コンポーネントを積極的に活用する
- **コメント**: モック画面の目的や検証内容をファイル冒頭にコメントで記載する

## Project Structure Reference

### Test Directory Structure
```
/home/shuhei2441/repo/quest-pay/packages/web/app/test/
├── page.tsx                         # メインテストページ
├── child-view-mock/                 # 子供閲覧モック
├── fab-icons/                       # FABアイコンモック
├── fab-visibility/                  # FAB表示テスト
├── family-member-list-mock/         # 家族メンバー一覧モック
├── family-profile-mock/             # 家族プロフィールモック
├── quest-card-layouts/              # クエストカードレイアウト
├── settings-mock/                   # 設定モック
├── stripe-test/                     # Stripeテスト
└── theme/                           # テーマモック
```

### Key Files
- **Endpoints**: `/home/shuhei2441/repo/quest-pay/packages/web/app/(core)/endpoints.ts`
- **SideMenu**: `/home/shuhei2441/repo/quest-pay/packages/web/app/(app)/_components/SideMenu.tsx`
- **Test Directory**: `/home/shuhei2441/repo/quest-pay/packages/web/app/test/`

## Resources

### references/
このスキルには参考資料は含まれていない。必要に応じて、コーディング規約は `coding-standards` スキル、アーキテクチャパターンは `architecture-guide` スキルを参照すること。
