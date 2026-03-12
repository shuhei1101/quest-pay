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

### Step 1: Check Changed Files

Use `run_in_terminal` to check the current git status and identify changed files:

```bash
git status --short
```

### Step 2: Stage Session Changes Only

**重要**: すべての変更ではなく、このセッションで変更した内容のみをステージングする。

セッション中に変更したファイルを特定してステージング：

**ファイルの特定方法:**
1. このセッション中に実行したツール（`replace_string_in_file`, `multi_replace_string_in_file`, `create_file` など）の履歴を確認
2. それらのツールで編集・作成したファイルのパスをリストアップ
3. `git status` の出力と照合

**ステージング実行:**
```bash
# セッション中に変更したファイルのみを個別に追加
git add <file1> <file2> <file3>...
```

### Step 3: Generate Commit Message

Analyze the changes and generate a meaningful commit message that:
- Summarizes the changes concisely
- Uses Japanese for Quest Pay project
- Follows conventional commit format when appropriate (feat:, fix:, docs:, refactor:, etc.)
- References specific features or components modified

**Examples of good commit messages:**
- `feat: commit-autoスキルを追加`
- `fix: タイムアウトエラー画面の表示を修正`
- `refactor: 家族クエスト一覧のコンポーネント構造を改善`
- `docs: スキル作成ガイドを更新`

### Step 4: Commit Changes

Execute the commit with the generated message:

```bash
git commit -m "Your generated commit message"
```

The commit will be made to the current branch (typically main).

### Step 5: Confirm Completion

Inform the user that the commit was successful and provide the commit message used.

## Important Notes

- Always commit to the current branch
- Generate commit messages autonomously without asking the user
- Use Japanese for commit messages in this project
- Keep commit messages concise but descriptive
- Do NOT push changes automatically - only commit locally
