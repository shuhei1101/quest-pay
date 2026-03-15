(2026年3月記載)

# ワークフローガイド

## 概要

画面エージェントとスキルを作成する際の標準ワークフローを定義する。

## 作成ワークフロー

### ステップ1: 画面の特定とパス調査

**目的**: エージェントを作成する画面を特定し、関連パスを調査

**タスク**:
1. `app/(core)/endpoints.ts` で画面のエンドポイントを確認
2. `app/(app)/` 配下で画面のディレクトリ構造を確認
3. `app/api/` 配下でAPIルートを確認
4. 関連する共通コンポーネントを確認

**コマンド例**:
```bash
# 画面構造を確認
bash .github/skills/common-structure/scripts/generate_screen_structure.sh app/(app)/{screen}

# API構造を確認
bash .github/skills/common-structure/scripts/generate_api_structure.sh app/api/{resource}

# endpoints.tsを確認
grep -A 5 "{screen}" packages/web/app/(core)/endpoints.ts
```

**記録すべき情報**:
- 画面のルートパス
- Screen コンポーネントのパス
- Layout コンポーネントのパス
- API ルートのパス
- hooks のパス
- 関連する共通コンポーネント

### ステップ2: エージェントとスキル群の初期化

**目的**: エージェントファイルとスキル群を一括生成

**コマンド**:
```bash
.github/skills/screen-agent-builder/scripts/init_screen_agent.sh <screen-name> "<screen-title>" [skill-types...]
```

**引数**:
- `<screen-name>`: エージェント名（ハイフン区切り）
- `<screen-title>`: 画面のタイトル（日本語OK）
- `[skill-types...]`: 生成するスキルタイプ（list, view, edit, api, structure, usage）

**使用例**:
```bash
# 家族クエスト画面（フルセット）
.github/skills/screen-agent-builder/scripts/init_screen_agent.sh family-quest "家族クエスト" list view edit api

# タイムライン画面（閲覧のみ）
.github/skills/screen-agent-builder/scripts/init_screen_agent.sh timeline "タイムライン" structure api

# AppShellレイアウト
.github/skills/screen-agent-builder/scripts/init_screen_agent.sh app-shell "AppShell" structure usage
```

**生成される構造**:
```
.github/
├── agents/
│   └── {screen-name}.agent.md         # エージェントファイル
└── skills/
    ├── {screen-name}-list/            # 一覧スキル（指定時）
    │   ├── SKILL.md
    │   └── references/
    ├── {screen-name}-view/            # 閲覧スキル（指定時）
    │   ├── SKILL.md
    │   └── references/
    ├── {screen-name}-edit/            # 編集スキル（指定時）
    │   ├── SKILL.md
    │   └── references/
    └── {screen-name}-api/             # APIスキル（指定時）
        ├── SKILL.md
        └── references/
```

### ステップ3: エージェントファイルの編集

**目的**: エージェントの applyTo と担当パスを正確に設定

**編集項目**:

#### 1. YAMLフロントマター
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

**applyTo設定のポイント**:
- 具体的なパスを指定
- 関連するすべてのファイルをカバー
- 他エージェントとの重複を避ける

#### 2. 担当パスの記載
```markdown
## 担当パス
### 画面
- `app/(app)/{screen}/page.tsx`: {説明}
- `app/(app)/{screen}/{Screen}Screen.tsx`: {説明}
- `app/(app)/{screen}/[id]/page.tsx`: {説明}
...

### API
- `app/api/{resource}/route.ts`: {説明}
- `app/api/{resource}/client.ts`: {説明}
...

### コンポーネント
- `app/(app)/{screen}/_components/{Component}.tsx`: {説明}
...
```

### ステップ4: スキルの作成と内容記述

**目的**: 各スキルのSKILL.mdとreferencesを作成

#### 4.1 SKILL.mdの編集

**基本構造に従い記述**:
```markdown
---
name: {screen-name}-{aspect}
description: {簡潔な1行説明}
---

# {Screen Name} {Aspect} スキル

## 概要
{1-2文で目的を説明}

## メインソースファイル
{主要ファイルのリスト}

## 主要機能グループ
{3-5個の機能グループ}

## Reference Files Usage
{詳細情報へのナビゲーション}

## クイックスタート
{初めて使う人向けの簡単な使い方}

## 実装上の注意点
{重要な注意点}
```

**記述のポイント**:
- 簡潔に（300-500行程度）
- 詳細はreferences/に記載
- ナビゲーションを明確に

#### 4.2 References/の作成

**各スキルタイプに応じたreferencesを作成**:

**一覧スキル (list)**:
- `screen_structure.md`: 画面構造
- `components.md`: コンポーネント詳細
- `data_flow.md`: データフロー

**閲覧スキル (view)**:
- `display_sections.md`: 表示セクション詳細
- `permissions.md`: 権限制御

**編集スキル (edit)**:
- `form_structure.md`: フォーム構造
- `validation_rules.md`: バリデーション詳細
- `save_flow.md`: 保存処理フロー

**APIスキル (api)**:
- `er_diagram.md`: テーブル構造
- `flow_diagram.md`: ライフサイクル
- `sequence_diagram.md`: 処理シーケンス
- `api_endpoints.md`: API仕様詳細

**構造スキル (structure)**:
- `layout_structure.md`: レイアウト詳細構造

**使用方法スキル (usage)**:
- `props_definition.md`: Props詳細
- `usage_examples.md`: 使用例

**記述テンプレート** (各referencesファイルの冒頭):
```markdown
(2026年3月記載)

# {Title}

## 概要
{このファイルの目的}

## {Section 1}
{詳細内容}

## {Section 2}
{詳細内容}
...
```

### ステップ5: スキルアップデート機能の実装

**目的**: エージェントがスキルを自動更新できるようにする

**実装パターン**:
```markdown
## スキルアップデート方法

### 担当スキル
- {skill-1}: {説明}
- {skill-2}: {説明}
...

### アップデート手順
1. 担当スキルを読み込む
2. 関連ディレクトリの現在の構造を確認（`list_dir`、`file_search`）
3. スキルに記載されているパスと実際の構造を比較
4. 差分があれば、スキルの内容を更新

### 例: 家族クエストAPIスキルの更新
1. `family-quest-api/SKILL.md` を読み込む
2. `app/api/quests/family/` の現在の構造を取得
3. `SKILL.md` のメインソースファイルセクションと比較
4. 新しいエンドポイントがあれば追記
5. 削除されたエンドポイントは削除
```

### ステップ6: テストと検証

**目的**: エージェントとスキルが正しく動作することを確認

**テスト項目**:
1. **エージェント呼び出し**: `@{screen-name}` で呼び出せるか
2. **スキル読み込み**: エージェントがスキルを正しく読み込めるか
3. **applyTo動作**: 対象ファイル編集時にエージェントが自動選択されるか
4. **スキルアップデート**: エージェントがスキルを更新できるか

**検証コマンド例**:
```bash
# エージェントの存在確認
ls .github/agents/{screen-name}.agent.md

# スキルの存在確認
ls .github/skills/{screen-name}-*/

# YAMLフロントマター検証
head -10 .github/agents/{screen-name}.agent.md

# スキルリスト確認
grep -A 5 "## 担当スキル" .github/agents/{screen-name}.agent.md
```

## 更新ワークフロー

### 既存エージェント・スキルの更新

**ケース1: 機能追加による更新**

**手順**:
1. 新しい機能のファイルを特定
2. 該当スキルのSKILL.mdを更新
3. 必要に応じてreferencesを追加
4. エージェントのapplyToを更新（新しいパスが追加された場合）

**ケース2: ファイル移動・リネーム**

**手順**:
1. 新しいパス構造を確認
2. すべての関連スキルのパス記載を更新
3. エージェントのapplyToを更新

**ケース3: 機能削除**

**手順**:
1. 削除されたファイルを特定
2. スキルから該当記載を削除
3. 不要になったreferencesを削除

### スキルアップデート機能の活用

**エージェントにスキルアップデートを依頼**:
```
@{screen-name}-agent
担当スキルの内容を確認して、最新の構造に更新してください。
```

**エージェントの実行内容**:
1. 担当スキルを読み込み
2. common-structureスクリプトで現在の構造を取得
3. スキルの記載と実際の構造を比較
4. 差分があればスキルを更新

## ベストプラクティス

### エージェント作成時
1. **調査を先に**: 構造を理解してから作成
2. **スクリプト活用**: init_screen_agent.shで一括生成
3. **明確なapplyTo**: 具体的で重複のないパスを指定

### スキル作成時
1. **Progressive Disclosure**: SKILL.mdは簡潔に、詳細はreferences/
2. **ナビゲーション重視**: Reference Files Usageで案内
3. **スクリプト化**: 繰り返し作業はscripts/に配置

### 保守時
1. **定期更新**: 機能追加・変更時にスキルも更新
2. **エージェント活用**: スキルアップデート機能を使う
3. **削除も大切**: 不要になったreferencesは削除

### トークン効率化
1. **スクリプト実行**: 構造分析はスクリプトに任せる
2. **段階的開示**: 必要な時だけreferencesを読み込む
3. **簡潔な記述**: 冗長な説明を避ける

## トラブルシューティング

### エージェントが呼び出せない
- ファイル名を確認（`.agent.md`拡張子）
- YAMLフロントマターの構文エラーをチェック
- nameフィールドが正しいか確認

### スキルが読み込まれない
- スキル名がエージェントのskillGroupsに含まれているか確認
- SKILL.mdのYAMLフロントマターを確認
- ファイルパスが正しいか確認

### applyToが動作しない
- グロブパターンの構文を確認
- 対象ファイルのパスがパターンにマッチするか確認
- 他エージェントとの競合をチェック

### スキル更新が反映されない
- ファイルを保存したか確認
- VSCodeを再起動（必要に応じて）
- キャッシュクリア（必要に応じて）
