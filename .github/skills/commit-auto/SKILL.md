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

### Step 2: Security Check

**重要**: コミット前に変更ファイルのセキュリティチェックを実行する。

`scripts/security_check.sh` は以下をチェックする：
- APIキー（AWS, Google, GitHub, Stripe等）
- パスワードや認証情報
- プライベートキー
- トークン（Bearer, JWT等）
- その他の機密情報

**セキュリティチェック結果の対応:**
- ✅ 問題なし → コミットを続行
- ⚠️ リスク検出 → ユーザーに警告を表示し、対応方法を提示
- False positive の場合 → `--skip-security` オプション使用を案内

### Step 3: Generate Commit Message

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

### Step 4: Execute Commit Script

**重要**: `scripts/commit_session_changes.sh`スクリプトを使用してコミットする。このスクリプトは：
- ファイルの存在確認
- **セキュリティチェックの実行（自動）**
- 個別ファイル指定によるステージング（`git add -A`等を使用しない）
- 安全なコミット実行

**実行方法:**
```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh "<コミットメッセージ>" <file1> <file2> <file3>...
```

**セキュリティチェックをスキップ（false positiveの場合）:**
```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh --skip-security "<コミットメッセージ>" <file1> <file2> <file3>...
```

**例:**
```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh \
  "feat: モック画面管理用エージェントを追加" \
  .github/agents/mock-agent.md \
  .github/skills/mock-list/SKILL.md
```

### Step 5: Handle Security Issues

セキュリティチェックで問題が検出された場合：

1. **検出内容をユーザーに報告**
   - どのファイルで何が検出されたか
   - 検出されたパターン（APIキー、パスワード等）

2. **対応方法を提示**
   - 機密情報を環境変数に移動（`.env`ファイル）
   - `.gitignore`に`.env`を追加
   - シークレット管理サービスの使用を推奨

3. **意図的な場合の対応**
   - False positive（テストデータ等）の場合は`--skip-security`オプション使用を案内
   - ユーザーの判断を仰ぐ

### Step 6: Confirm Completion

ユーザーにコミット成功を報告し、使用したコミットメッセージを提示する。

## Important Notes

- Always use the `scripts/commit_session_changes.sh` script for commits
- **セキュリティチェックは自動実行される** - APIキー等の機密情報を検出
- Generate commit messages autonomously without asking the user
- Use Japanese for commit messages in this project
- Keep commit messages concise but descriptive
- Do NOT push changes automatically - only commit locally
- **CRITICAL**: The script enforces session-only file commits - never use manual `git add -A`, `git add .`, or `git add --all` commands

## Security Check Details

セキュリティチェックで検出される項目：
- **AWS**: Access Key, Secret Key
- **Google**: API Key, OAuth credentials
- **GitHub**: Personal Access Tokens
- **Stripe**: Secret Key, Publishable Key
- **SSH**: Private keys (RSA, EC, DSA)
- **Generic**: パスワード、APIキー、Bearer Token, JWT

**False Positive の除外:**
- `example`, `sample`, `test`, `mock`, `dummy`等のキーワードを含む行は除外
- バイナリファイルは自動スキップ

## Bundled Resources

### scripts/commit_session_changes.sh

Safe commit script that:
- Validates file existence before staging
- **Executes security check automatically**
- Stages only specified files (prevents accidental commits)
- Provides clear feedback at each step
- Exits on any error
- Supports `--skip-security` option for false positives

Usage documented in the workflow above.

### scripts/security_check.sh

Security validation script that:
- Scans files for API keys, passwords, tokens
- Uses regex patterns for common secret formats
- Excludes false positives (test/example data)
- Skips binary files automatically
- Provides detailed detection reports
- Exits with error code if risks found

Called automatically by `commit_session_changes.sh`.
