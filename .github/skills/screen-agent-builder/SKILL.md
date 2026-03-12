---
name: screen-agent-builder
description: This skill should be used when creating screen-specific custom agents and their associated skills for the Quest Pay project. It provides a standardized workflow for building agents that manage specific screens, their layouts, APIs, and components.
---

# Screen Agent Builder

## Overview

このスキルは、Quest Payプロジェクトの各画面に特化したカスタムエージェントとスキル群を作成するための標準化されたワークフローを提供する。各画面エージェントは、その画面に関連するすべてのパス、コンポーネント、API、レイアウトを熟知し、機能改修・機能説明・スキルアップデートの3つの責務を持つ。

## 画面エージェントの設計思想

### 構造
各画面には以下の構成要素が存在する：
- **カスタムエージェント**: 画面全体を管理する対話型エージェント（`.agent.md`）
- **スキル群**: 画面の構造知識を保持する知識提供型スキル（複数の`SKILL.md`）

### エージェントの3つの責務
1. **機能改修**: 画面に関連する機能の追加・修正・削除
2. **機能説明**: 画面の構造・処理フロー・関連ファイルの説明
3. **スキルアップデート**: 現在のフォルダ状況を確認し、担当スキルの内容を更新

### スキルの役割
各画面エージェントは、以下のようなスキルを持つ：
- 画面表示スキル（例: 家族クエスト閲覧画面スキル）
- 編集画面スキル（例: 家族クエスト編集画面スキル）
- API操作スキル（例: 家族クエストAPIスキル）
- その他の関連スキル

## 作成ワークフロー

### Step 1: 画面の特定とパス調査

まず、エージェントを作成する画面を特定し、関連するパスを調査する：

1. `app/(core)/endpoints.ts` で画面のエンドポイントを確認
2. `app/(app)/` 配下で画面のディレクトリ構造を確認
3. `app/api/` 配下でAPIルートを確認
4. 関連する共通コンポーネントを確認（`app/(core)/_components/`, `app/(app)/_components/`）

**調査対象の情報:**
- 画面のルートパス
- Screen コンポーネントのパス
- Layout コンポーネントのパス
- API ルートのパス
- hooks のパス
- 関連する共通コンポーネント

### Step 2: スキル群の作成

画面に関連する各スキルを初期化する：

```bash
# skill-creator/scriptsのinit_skill.pyを使用
python3 .github/skills/skill-creator/scripts/init_skill.py <screen-name>-<aspect>-skill --path .github/skills
```

生成されたスキルのSKILL.mdを編集して、画面の構造・責務・パス情報を記述する。

### Step 3: カスタムエージェントの作成

画面エージェント初期化スクリプトを使用してエージェントとスキル群を一括作成：

```bash
# 単一コマンドでエージェントとスキル群を初期化
.github/skills/screen-agent-builder/scripts/init_screen_agent.sh <screen-name> "<screen-title>" [skill-types...]

# 例: 家族クエスト画面
.github/skills/screen-agent-builder/scripts/init_screen_agent.sh family-quest "家族クエスト" list view edit api
```

スクリプトは以下を実行：
1. 指定されたスキルタイプのスキル群を作成
2. エージェントファイルを生成
3. スキルリストをエージェントに自動登録


### Step 4: スキルアップデート機能の実装

各エージェントには、現在のフォルダ構造を確認してスキルを自動更新する機能を持たせる。

**実装パターン:**
1. 担当スキルを読み込む
2. 関連ディレクトリの現在の構造を確認（`list_dir`、`file_search`）
3. スキルに記載されているパスと実際の構造を比較
4. 差分があれば、スキルの内容を更新

## 画面カテゴリとスキル構成パターン

### パターン1: CRUD画面（家族クエスト、公開クエスト、テンプレートクエスト等）

**スキル構成:**
- `<screen>-list-skill`: 一覧表示に関する知識
- `<screen>-view-skill`: 詳細閲覧に関する知識
- `<screen>-edit-skill`: 編集画面に関する知識
- `<screen>-api-skill`: API操作に関する知識

**ファイル構成例（家族クエスト）:**
```
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
