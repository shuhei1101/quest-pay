# GitHub Copilot 向け指示書

## スキルとカスタムエージェントの活用

- **スキル**: 自動的にロードされ、コーディング規約やアーキテクチャの知識を提供
- **カスタムエージェント**: `@`で選択して対話的に作業（画面ごと、コードレビュー、説明など）

## Agent Creator モード専用指示

**重要**: `agent-creator`モードで動作している時（スキルやエージェントの作成・編集時）は、まず`skill-creator`スキルを必ず読み込むこと：

```
read_file: .github/skills/skill-creator/SKILL.md
```

**理由**:
- スキルの正しい構造（SKILL.md + scripts/ + references/ + assets/）を理解するため
- 繰り返し実行するコードは`scripts/`にスクリプトとして配置し、コンテキストを軽量化するため
- 詳細なドキュメントは`references/`に配置し、必要時にのみ読み込むため
- Progressive Disclosure（段階的開示）の原則に従うため

**スキル作成時のベストプラクティス**:
- 繰り返し実行するコード → `scripts/`ディレクトリにスクリプト化
- 詳細なドキュメント・参照資料 → `references/`ディレクトリ
- テンプレートや出力用ファイル → `assets/`ディレクトリ
- SKILL.md本体は軽量に保ち、ワークフローと使用方法のみを記載

## アプリ概要
- **お小遣いクエストボード**: 親がクエストを登録、子供が実行してお小遣いを獲得
- **技術**: Next.js + MantineUI + Supabase
- **ファイルパス**: `drizzle/schema.ts`（DB）、`app/(core)/endpoints.ts`（エンドポイント）

## 開発ルール
- **コーディング**: `coding-standards`スキル参照（日本語、セミコロン禁止、type優先）
- **アーキテクチャ**: `architecture-guide`スキル参照（page.tsx→Screen→Layout構成）
- **DB操作**: `database-operations`スキル参照（Drizzle低レベルクエリ、排他制御）
