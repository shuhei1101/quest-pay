# GitHub Copilot 向け指示書

## スキルとカスタムエージェントの活用

- **スキル**: 自動的にロードされ、コーディング規約やアーキテクチャの知識を提供
- **カスタムエージェント**: `@`で選択して対話的に作業（画面ごと、コードレビュー、説明など）

## スキル発見の重要性 ⚠️

**作業前に必ずスキルカタログを確認してください！**

このプロジェクトには64個以上の専門スキルがあります。不明な領域や、親要素・関連要素に関わる作業では、必ずカタログから関連スキルを探して読み込んでください。

### スキルカタログの使い方
1. **カタログを確認**: `.github/skills/SKILLS_CATALOG.md` を読み込む
2. **関連カテゴリを探す**: UI/API/DB/共通など、作業に関連するカテゴリを確認
3. **スキルを読み込む**: 必要なスキルを `read_file` で読み込む

```
# 例: スクロール調整時
read_file: .github/skills/SKILLS_CATALOG.md  # カタログ確認
read_file: .github/skills/app-shell-structure/SKILL.md  # 親要素の構造を理解
```

**重要**: トークンコストを恐れずに、必要なスキルは積極的に読み込むこと。不完全な知識での実装は、後で修正コストが高くつきます。

## コミット時の必須スキル ⚠️

**gitコミット操作を行う前に必ず `commit-auto` スキルを読み込んでください！**

- コミットメッセージフォーマット: `{ドメイン名}、{ラベル}（{変更概要}）`
- 例: `エージェント管理、新規機能（スキル発見機能を追加）`
- **禁止**: `feat:`, `fix:`, GIT `docs:` などのConventional Commits形式は使用しない

```
# コミット前に必ず実行
read_file: .github/skills/commit-auto/SKILL.md
read_file: .github/skills/commit-auto/references/commit_format.md  # フォーマット詳細
```

**理由**: このプロジェクトは独自のコミットメッセージフォーマットを採用しており、一般的なGitHub規約とは異なります。commit-autoスキルにフォーマット定義とセキュリティチェックスクリプトがあります。

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
