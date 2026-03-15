(2026年3月記載)

# エージェントパターン

## 概要

画面エージェントの構造パターンと設計指針を定義する。

## エージェントの基本構造

### ファイル構成
```
.github/agents/{screen-name}.agent.md
```

### YAMLフロントマター
```yaml
---
name: {screen-name}-agent
description: {画面名}画面のエージェント。機能改修、機能説明、スキルアップデートを担当。
applyTo:
  - "packages/web/app/(app)/{screen-path}/**"
  - "packages/web/app/api/{api-path}/**"
skillGroups:
  - {screen-name}-skills
---
```

### エージェント本体
```markdown
# {画面名} エージェント

## 役割
このエージェントは{画面名}画面の専門家として以下を担当：
1. 機能改修: 画面に関連する機能の追加・修正・削除
2. 機能説明: 画面の構造・処理フロー・関連ファイルの説明
3. スキルアップデート: 担当スキルの内容を更新

## 担当スキル
- {skill-1}: {説明}
- {skill-2}: {説明}
...

## 担当パス
### 画面
- `{screen-path}/page.tsx`
- `{screen-path}/{Screen}.tsx`
...

### API
- `app/api/{api-path}/route.ts`
- `app/api/{api-path}/client.ts`
...
```

## エージェントタイプ別パターン

### タイプ1: CRUD画面エージェント

**適用画面**: 家族クエスト、公開クエスト、テンプレートクエストなど

**特徴**:
- 4つのスキル（list, view, edit, api）
- 複数の画面パスを担当
- 豊富なAPI操作

**テンプレート**:
```yaml
---
name: {resource}-quest-agent
description: {Resource}クエスト画面のエージェント。一覧・閲覧・編集画面とAPIを担当。
applyTo:
  - "packages/web/app/(app)/{resource}-quests/**"
  - "packages/web/app/api/quests/{resource}/**"
skillGroups:
  - {resource}-quest-skills
---

# {Resource}クエスト エージェント

## 役割
{Resource}クエストの一覧表示、詳細閲覧、編集、API操作を担当。

## 担当スキル
- {resource}-quest-list: 一覧画面
- {resource}-quest-view: 閲覧画面
- {resource}-quest-edit: 編集画面
- {resource}-quest-api: API操作

## 担当パス
### 画面
- `app/(app)/{resource}-quests/page.tsx`: 一覧画面
- `app/(app)/{resource}-quests/[id]/page.tsx`: 編集画面
- `app/(app)/{resource}-quests/[id]/view/page.tsx`: 閲覧画面

### API
- `app/api/quests/{resource}/route.ts`: CRUD基本操作
- `app/api/quests/{resource}/[id]/route.ts`: 詳細操作
- `app/api/quests/{resource}/[id]/{action}/route.ts`: アクション操作
```

### タイプ2: 閲覧専用画面エージェント

**適用画面**: タイムライン、通知一覧など

**特徴**:
- 1-2つのスキル（structure, api）
- 編集機能なし
- データ取得専用

**テンプレート**:
```yaml
---
name: {screen}-agent
description: {Screen}画面のエージェント。閲覧とAPIを担当。
applyTo:
  - "packages/web/app/(app)/{screen}/**"
  - "packages/web/app/api/{screen}/**"
skillGroups:
  - {screen}-skills
---

# {Screen} エージェント

## 役割
{Screen}画面の表示とデータ取得を担当。

## 担当スキル
- {screen}-structure: 画面構造
- {screen}-api: API操作

## 担当パス
### 画面
- `app/(app)/{screen}/page.tsx`
- `app/(app)/{screen}/{Screen}Screen.tsx`

### API
- `app/api/{screen}/route.ts`
```

### タイプ3: 子供向け画面エージェント

**適用画面**: 子供クエスト、子供報酬設定など

**特徴**:
- 子供専用の操作
- 簡略化されたUI
- 親画面とは独立

**テンプレート**:
```yaml
---
name: child-{screen}-agent
description: 子供向け{Screen}画面のエージェント。子供専用の操作を担当。
applyTo:
  - "packages/web/app/(app)/children/{screen}/**"
  - "packages/web/app/api/children/**"
skillGroups:
  - child-{screen}-skills
---

# 子供向け{Screen} エージェント

## 役割
子供ユーザー専用の{Screen}画面を担当。

## 担当スキル
- child-{screen}-list: 一覧画面
- child-{screen}-view: 閲覧画面
- child-{screen}-api: API操作

## 担当パス
### 画面
- `app/(app)/children/{screen}/page.tsx`

### API
- `app/api/children/{screen}/route.ts`
```

### タイプ4: レイアウトエージェント

**適用対象**: AppShell、共通レイアウトコンポーネント

**特徴**:
- 複数画面で共通使用
- UI/UX に特化
- スタイリング管理

**テンプレート**:
```yaml
---
name: {layout}-agent
description: {Layout}レイアウトのエージェント。共通レイアウトコンポーネントを担当。
applyTo:
  - "packages/web/app/(core)/_components/{layout}/**"
skillGroups:
  - {layout}-skills
---

# {Layout}レイアウト エージェント

## 役割
{Layout}レイアウトの構造と機能を担当。

## 担当スキル
- {layout}-structure: レイアウト構造
- {layout}-usage: 使用方法

## 担当パス
- `app/(core)/_components/{layout}/`
```

## applyToパターン

### パターン1: 単一画面
```yaml
applyTo:
  - "packages/web/app/(app)/{screen}/**"
```

### パターン2: 画面 + API
```yaml
applyTo:
  - "packages/web/app/(app)/{screen}/**"
  - "packages/web/app/api/{api}/**"
```

### パターン3: 複数関連パス
```yaml
applyTo:
  - "packages/web/app/(app)/{screen1}/**"
  - "packages/web/app/(app)/{screen2}/**"
  - "packages/web/app/api/{api}/**"
```

### パターン4: 共通コンポーネント
```yaml
applyTo:
  - "packages/web/app/(core)/_components/{component}/**"
```

## エージェント命名規則

### 基本形式
```
{resource}-agent.md
{resource}-{aspect}-agent.md
{layout}-agent.md
```

### 具体例
- `family-quest-agent.md`: 家族クエスト画面
- `child-quest-agent.md`: 子供クエスト画面
- `app-shell-agent.md`: AppShellレイアウト
- `login-agent.md`: ログイン画面
- `error-agent.md`: エラー画面

## ベストプラクティス

### エージェント分割の指針
1. **画面単位**: 基本的に1画面=1エージェント
2. **機能の独立性**: 他画面と独立して動作する場合は分離
3. **共通性**: 複数画面で共有する場合は共通エージェント

### applyToの設定
1. **具体的**: できるだけ具体的なパスを指定
2. **包括的**: 関連するすべてのファイルをカバー
3. **重複回避**: 他エージェントとの重複を最小化

### スキル分割の指針
1. **単一責任**: 1スキル=1つの役割
2. **サイズ制限**: SKILL.md は簡潔に、詳細はreferences/
3. **Progressive Disclosure**: 段階的に情報を開示
