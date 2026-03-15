---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
license: Complete terms in LICENSE.txt
---

# Skill Creator

このスキルは、効果的なスキルを作成するためのガイダンスを提供します。

## 概要

スキルは、専門知識、ワークフロー、ツールを提供することでClaudeの機能を拡張するモジュール式の自己完結型パッケージです。特定のドメインやタスクの「オンボーディングガイド」と考えることができます。

### スキルが提供するもの

1. **専門ワークフロー**: 特定ドメインの多段階手順
2. **ツール統合**: 特定ファイル形式やAPIとの連携手順
3. **ドメイン専門知識**: 企業固有の知識、スキーマ、ビジネスロジック
4. **バンドルリソース**: 複雑で繰り返しのタスク用のスクリプト、参照資料、アセット

### スキルの構造

すべてのスキルは必須のSKILL.mdファイルとオプションのバンドルリソースで構成されます:

```
skill-name/
├── SKILL.md (必須)
│   ├── YAMLフロントマター (必須)
│   │   ├── name: (必須)
│   │   └── description: (必須)
│   └── Markdownインストラクション (必須)
└── Bundled Resources (オプション)
    ├── scripts/          - 実行可能コード (Python/Bash/etc.)
    ├── references/       - 必要時にロードするドキュメント
    └── assets/           - 出力で使用するファイル
```

### Progressive Disclosure 原則

スキルは3段階のローディングシステムでコンテキストを効率管理:

1. **メタデータ (name + description)** - 常にコンテキスト内 (~100 words)
2. **SKILL.md本体** - スキルトリガー時 (<5k words推奨)
3. **Bundled Resources** - Claudeが必要と判断時 (無制限*)

*スクリプトはコンテキストにロードせずに実行可能なため実質無制限

## Reference Files Usage

### スキル作成プロセスを理解する場合
6ステップの詳細なワークフロー、各ステップの目的と実装方法:
```
references/six_step_process.md
```

### ディレクトリ構造を理解する場合
SKILL.md、scripts/、references/、assets/の使い分けと構造:
```
references/directory_structure.md
```

### ベストプラクティスを確認する場合
Progressive Disclosure、トークン効率、文体ルール、具体例:
```
references/best_practices.md
```

## クイックスタート

1. **概要理解**: このSKILL.mdで基本構造とProgressive Disclosure原則を把握
2. **プロセス確認**: `references/six_step_process.md`で詳細な6ステップを確認
3. **構造設計**: `references/directory_structure.md`でディレクトリ構成を理解
4. **実装時**: `references/best_practices.md`でトークン効率と文体ルールを参照

## 基本ワークフロー

### 1. 具体例の収集
ユーザーからスキルの使用例を収集、または生成して検証

### 2. リソースの計画
scripts/、references/、assets/に配置すべき内容を特定

### 3. 初期化（新規スキルの場合）
```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

### 4. 編集
- リソースファイルを実装（scripts/、references/、assets/）
- SKILL.mdを更新（命令形/不定詞形を使用）
- 詳細情報をreferences/に配置（Progressive Disclosure）

### 5. パッケージング
```bash
scripts/package_skill.py <path/to/skill-folder>
```

検証→パッケージング→zipファイル生成

## 実装上の注意点

### 必須パターン
- **SKILL.md軽量化**: <5,000 words、詳細はreferences/へ
- **命令形/不定詞形**: 動詞先の指示文、二人称禁止
- **三人称description**: "This skill should be used when..."
- **Progressive Disclosure**: メタデータ→SKILL.md→リソースの3段階
- **重複排除**: 情報は1箇所のみ

### リソース使い分け
- **scripts/**: 繰り返し書くコード、決定論的処理
- **references/**: Claudeが参照するドキュメント（スキーマ、API仕様等）
- **assets/**: 出力で使用するファイル（テンプレート、画像等）

### メタデータ品質
descriptionの良し悪しがスキルのトリガー精度を決定します。具体的で明確なdescriptionを記述してください。

### Step 6: Iterate

After testing the skill, users may request improvements. Often this happens right after using the skill, with fresh context of how the skill performed.

**Iteration workflow:**
1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again
