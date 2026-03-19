---
name: screen-agent-builder
description: This skill should be used when creating screen-specific custom agents and their associated skills for the Quest Pay project. It provides a standardized workflow for building agents that manage specific screens, their layouts, APIs, and components. Trigger Keywords: 画面エージェント、カスタムエージェント、エージェントビルダー、スキルビルダー、エージェント作成
---

# Screen Agent Builder

## 概要

このスキルは、Quest Payプロジェクトの各画面に特化したカスタムエージェントとスキル群を作成するための標準化されたワークフローを提供する。各画面エージェントは、その画面に関連するすべてのパス、コンポーネント、API、レイアウトを熟知し、機能改修・機能説明・スキルアップデートの3つの責務を持つ。

## メインスクリプト

### エージェント初期化
- `scripts/init_screen_agent.sh`: 画面エージェントとスキル群を一括生成

## 主要機能グループ

### 1. エージェント作成
画面エージェントファイル（`.agent.md`）の生成、applyTo設定、skillGroups登録

### 2. スキル群作成
画面に関連する複数スキル（list, view, edit, api等）の一括生成

### 3. 構造テンプレート提供
エージェントとスキルの標準構造を提供

## Reference Files Usage

### エージェントパターンを理解する場合
エージェントの基本構造、タイプ別パターン、applyTo設定を確認：
```
references/agent_patterns.md
```

### スキルパターンを理解する場合
スキルの基本構造、タイプ別構成、Progressive Disclosure原則を確認：
```
references/skill_patterns.md
```

### 作成ワークフローを把握する場合
ステップバイステップの作成手順、更新方法、ベストプラクティスを確認：
```
references/workflow_guide.md
```

### 画面パターン詳細を見る場合
CRUD画面、閲覧専用画面、子供向け画面などの詳細パターンを確認：
```
references/screen_patterns.md
```

## クイックスタート

1. **画面構造の調査**:
   ```bash
   bash .github/skills/common-structure/scripts/generate_screen_structure.sh app/(app)/{screen}
   ```

2. **エージェントとスキル群の生成**:
   ```bash
   .github/skills/screen-agent-builder/scripts/init_screen_agent.sh family-quest "家族クエスト" list view edit api
   ```

3. **エージェントファイルの編集**: applyToと担当パスを正確に設定

4. **スキルの作成**: 各スキルのSKILL.mdとreferences/を記述

## 実装上の注意点

### エージェント設計
- **画面単位**: 基本的に1画面=1エージェント
- **明確なapplyTo**: 具体的で重複のないパスを指定
- **3つの責務**: 機能改修、機能説明、スキルアップデート

### スキル設計
- **Progressive Disclosure**: SKILL.mdは簡潔に、詳細はreferences/
- **単一責任**: 1スキル=1つの役割
- **ナビゲーション**: Reference Files Usageで案内

### ワークフロー
1. **調査を先に**: 構造を理解してから作成
2. **スクリプト活用**: init_screen_agent.shで一括生成
3. **定期更新**: 機能追加・変更時にスキルも更新

### トークン効率化
- **スクリプト実行**: 構造分析はスクリプトに任せる
- **段階的開示**: 必要な時だけreferencesを読み込む
- **簡潔な記述**: 冗長な説明を避ける
app/(app)/quests/family/
├── page.tsx                    # リダイレクト
├── FamilyQuestsScreen.tsx      # 一覧画面
├── [id]/
│   ├── page.tsx                # リダイレクト
│   ├── FamilyQuestEditScreen.tsx  # 編集画面
│   └── view/
│       ├── page.tsx
│       └── FamilyQuestViewScreen.tsx  # 閲覧画面
├── _components/                # 画面固有コンポーネント
└── _hooks/                     # 画面固有フック

app/api/quests/family/
└── route.ts                    # API実装
```

### パターン2: レイアウトコンポーネント（クエスト一覧、クエスト詳細等）

**スキル構成:**
- `<layout>-structure-skill`: レイアウト構造に関する知識
- `<layout>-usage-skill`: 使用方法に関する知識

**ファイル構成例（クエスト一覧レイアウト）:**
```
app/(app)/quests/_components/
└── QuestListLayout.tsx
```

### パターン3: 共通機能（AppShellContent、共通コンポーネント等）

**スキル構成:**
- `<component>-structure-skill`: コンポーネント構造に関する知識
- `<component>-api-skill`: API連携に関する知識（必要に応じて）

### パターン4: システム構成（パス定義、DBスキーマ等）

**スキル構成:**
- `endpoints-skill`: エンドポイント定義に関する知識
- `schema-skill`: DBスキーマに関する知識

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## Quest Pay 画面一覧とエージェント構成

### 作成対象の画面エージェント

以下の画面に対して、それぞれカスタムエージェントとスキル群を作成する：

#### クエスト関連
1. **family-quest-agent** (家族クエスト画面)
   - `family-quest-list-skill`
   - `family-quest-view-skill`
   - `family-quest-edit-skill`
   - `family-quest-api-skill`

2. **public-quest-agent** (公開クエスト画面)
   - `public-quest-list-skill`
   - `public-quest-view-skill`
   - `public-quest-edit-skill`
   - `public-quest-api-skill`

3. **template-quest-agent** (テンプレートクエスト画面)
   - `template-quest-list-skill`
   - `template-quest-view-skill`
   - `template-quest-api-skill`

4. **child-quest-agent** (子供クエスト画面)
   - `child-quest-list-skill`
   - `child-quest-view-skill`
   - `child-quest-api-skill`

#### レイアウト関連
5. **quest-list-agent** (クエスト一覧レイアウト)
   - `quest-list-layout-structure-skill`
   - `quest-list-layout-usage-skill`

6. **quest-edit-agent** (クエスト詳細レイアウト)
   - `quest-edit-layout-structure-skill`
   - `quest-edit-layout-usage-skill`

#### コメント関連
7. **comment-agent** (コメント画面)
   - `comment-view-skill`
   - `comment-edit-skill`
   - `comment-api-skill`

#### 共通機能
8. **app-shell-agent** (AppShellContent)
   - `app-shell-structure-skill`
   - `app-shell-components-skill`

9. **components-agent** (共通コンポーネント)
   - `common-components-catalog-skill`
   - `common-components-usage-skill`

#### システム構成
10. **endpoints-agent** (パス関連)
    - `endpoints-definition-skill`

11. **schema-agent** (DBスキーマ)
    - `schema-structure-skill`
    - `schema-relations-skill`

#### その他の画面（追加で作成）
12. **home-agent** (ホーム画面)
13. **timeline-agent** (タイムライン画面)
14. **family-agent** (家族管理画面)
15. **child-management-agent** (子供管理画面)
16. **reward-agent** (報酬設定画面)
17. **notification-agent** (通知画面)

## 使用例

### 新しい画面エージェントを作成する場合

1. このスキル（`screen-agent-builder`）を参照
2. Step 1-4 に従ってエージェントとスキル群を作成
3. `repo-architect` エージェントに作成を依頼する場合:
   ```
   @repo-architect <画面名>画面のエージェントとスキルを作成してください
   ```

### 既存の画面エージェントを使用する場合

```
@family-quest-agent 家族クエスト一覧に検索機能を追加してください
```

### スキルをアップデートする場合

```
@family-quest-agent スキルをアップデートしてください
```

## リソース

### scripts/
- `init_screen_agent.sh`: 画面エージェントとスキル群を一括初期化するスクリプト

### references/
詳細なドキュメントや画面パターンの説明を配置する。

### assets/
テンプレートファイルを配置する（必要に応じて）。
