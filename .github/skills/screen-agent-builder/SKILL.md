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

画面に関連する各スキルを作成する：

1. **スキルの初期化**
   ```bash
   python .github/skills/skill-creator/scripts/init_skill.py <screen-name>-<aspect>-skill --path .github/skills
   ```

2. **スキルの構成要素を定義**
   - `SKILL.md`: 画面の構造・責務・パス情報を記述
   - `references/`: 詳細な構造図やフロー図を配置
   - `scripts/`: スキルアップデート用のスクリプトを配置

3. **SKILL.mdのフォーマット**
   ```markdown
   ---
   name: <screen-name>-<aspect>-skill
   description: <画面名>の<側面>に関する構造知識を提供するスキル。パス、コンポーネント、処理フローを含む。
   ---
   
   # <画面名> <側面> スキル
   
   ## 概要
   この画面の目的と責務を記述
   
   ## ファイル構成
   関連するすべてのファイルパスをリスト
   
   ## 主要コンポーネント
   主要なコンポーネントの役割と使用方法
   
   ## API エンドポイント
   関連するAPIエンドポイントとその用途
   
   ## 処理フロー
   画面の処理フローを記述
   ```

### Step 3: カスタムエージェントの作成

画面全体を管理するカスタムエージェントを作成する：

1. **エージェントファイルの作成**
   ```
   .github/agents/<screen-name>-agent.md
   ```

2. **エージェントの構造**
   ```markdown
   ---
   description: <画面名>画面を管理するエージェント。機能改修、機能説明、スキルアップデートを担当。
   name: <screen-name>-agent
   argument-hint: '改修内容、説明したい項目、またはアップデート指示を入力してください'
   model: Claude Sonnet 4.5
   ---
   
   # <画面名> Agent
   
   あなたは**<画面名>画面**を専門に管理するエージェントだ。
   この画面に関連するすべてのパス、コンポーネント、API、レイアウトを熟知している。
   
   ## 担当スキル
   
   以下のスキルを保持し、必要に応じて参照・更新する：
   - `<screen-name>-view-skill`: 閲覧画面に関する構造知識
   - `<screen-name>-edit-skill`: 編集画面に関する構造知識
   - `<screen-name>-api-skill`: API操作に関する知識
   
   **スキル参照方法:**
   各スキルは文脈に応じて自動的にロードされる。明示的に参照する場合は:
   ```
   read_file: .github/skills/<skill-name>/SKILL.md
   ```
   
   ## 責務
   
   ### 1. 機能改修
   - 画面に関連する機能の追加・修正・削除
   - コーディング規約（`coding-standards`）を参照して実装
   - アーキテクチャガイド（`architecture-guide`）に従って構成
   
   ### 2. 機能説明
   - 画面の構造を説明
   - 処理フローを解説
   - 関連ファイルの役割を説明
   
   ### 3. スキルアップデート
   - 現在のフォルダ状況を確認
   - 担当スキルの内容と実際の構造を比較
   - 差分があれば担当スキルを更新
   
   ## 作業フロー
   
   ### 機能改修時
   1. 要件をヒアリング
   2. 関連するスキルを参照
   3. `coding-standards`、`architecture-guide` を参照
   4. 実装を行う
   5. 変更内容に基づいてスキルを更新
   6. 音声で完了報告
   
   ### 機能説明時
   1. 説明対象を特定
   2. 関連するスキルを参照
   3. 構造・フロー・ファイルを説明
   
   ### スキルアップデート時
   1. 担当スキルを読み込む
   2. 現在のフォルダ構造を確認
   3. 差分を特定
   4. スキルを更新
   5. 音声で完了報告
   
   ## タスク完了時の音声通知（必須）
   
   すべてのタスク完了時に音声で報告する：
   ```
   mcp_yomiage_speak(text="{完了内容}")
   ```
   
   ## 制約
   
   - **範囲外の作業はしない**: この画面に関連しない機能修正は他のエージェントに委譲
   - **規約遵守**: `coding-standards`、`architecture-guide`、`database-operations` を必ず参照
   - **スキル優先**: 実装前に必ず関連スキルを参照して現在の構造を理解
   ```


### Step 4: スキルアップデート機能の実装

各エージェントには、現在のフォルダ構造を確認してスキルを自動更新する機能を持たせる。

**実装パターン:**
1. 担当スキルを読み込む
2. 関連ディレクトリの現在の構造を確認（`list_dir`、`file_search`）
3. スキルに記載されているパスと実際の構造を比較
4. 差分があれば、スキルの内容を更新
5. 更新内容を音声で報告

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
5. **quest-list-layout-agent** (クエスト一覧レイアウト)
   - `quest-list-layout-structure-skill`
   - `quest-list-layout-usage-skill`

6. **quest-edit-layout-agent** (クエスト詳細レイアウト)
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

9. **common-components-agent** (共通コンポーネント)
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
このスキルにはスキルアップデート用のスクリプトを含めることができる。

**例:**
- `update_skill.py`: フォルダ構造を解析してスキルを自動更新

### references/
詳細なドキュメントを配置する。

**例:**
- `agent_template.md`: エージェントファイルのテンプレート
- `skill_template.md`: スキルファイルのテンプレート
- `screen_patterns.md`: 画面パターンの詳細説明

### assets/
テンプレートファイルを配置する。

**例:**
- `agent-template.md`: カスタムエージェントのテンプレート
- `skill-template.md`: スキルのテンプレート
