---
name: commit-auto
description: This skill should be used when the user requests to commit changes using phrases like "これでOK", "コミットして", "commit this", or similar approval statements. It automates the git workflow by staging changes and creating commits with self-generated meaningful commit messages.
---

# Commit Auto

## Overview

Automate git commit workflow by staging changes and creating commits with auto-generated meaningful messages when users approve changes.

## When to Use This Skill

Use this skill when the user provides approval or requests to commit changes with phrases such as:
- "これでOK"
- "コミットして"
- "commit this"
- "変更をコミット"
- "OK, commit it"

## Commit Workflow

When the user requests a commit, follow this workflow:

### Step 1: Identify Session Changes

**重要**: このセッション中に実行したツールの履歴を確認し、変更したファイルを特定する。

**ファイルの特定方法:**
1. このセッション中に実行したツール（`replace_string_in_file`, `multi_replace_string_in_file`, `create_file`）の履歴を確認
2. それらのツールで編集・作成したファイルのパスをリストアップ
3. `git status --short` で変更状態を確認

### Step 2: Generate Commit Message

セッション中の変更内容を分析し、意味のあるコミットメッセージを生成する：

- 変更を簡潔に要約
- 日本語を使用（Quest Payプロジェクト）
- Conventional Commit形式に従う（feat:, fix:, docs:, refactor: など）
- 変更した機能やコンポーネントを明記

**良いコミットメッセージの例:**
- `feat: commit-autoスキルを追加`
- `fix: タイムアウトエラー画面の表示を修正`
- `refactor: 家族クエスト一覧のコンポーネント構造を改善`
- `docs: スキル作成ガイドを更新`

### Step 3: Execute Commit Script

**重要**: `scripts/commit_session_changes.sh`スクリプトを使用してコミットする。このスクリプトは：
- ファイルの存在確認
- 個別ファイル指定によるステージング（`git add -A`等を使用しない）
- 安全なコミット実行

**実行方法:**
```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh "<コミットメッセージ>" <file1> <file2> <file3>...
```

**例:**
```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh \
  "feat: モック画面管理用エージェントを追加" \
  .github/agents/mock-agent.md \
  .github/skills/mock-list/SKILL.md
```

### Step 4: Confirm Completion

ユーザーにコミット成功を報告し、使用したコミットメッセージを提示する。

## Important Notes

- Always use the `scripts/commit_session_changes.sh` script for commits
- Generate commit messages autonomously without asking the user
- Use Japanese for commit messages in this project
- Keep commit messages concise but descriptive
- Do NOT push changes automatically - only commit locally
- **CRITICAL**: The script enforces session-only file commits - never use manual `git add -A`, `git add .`, or `git add --all` commands

## Bundled Resources

### scripts/commit_session_changes.sh

Safe commit script that:
- Validates file existence before staging
- Stages only specified files (prevents accidental commits)
- Provides clear feedback at each step
- Exits on any error

Usage documented in the workflow above.
