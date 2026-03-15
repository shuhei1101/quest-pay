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
- **フォーマット**: `{ドメイン名}、{ラベル}（{変更概要}）`
  - **ドメイン名**: 変更対象のドメイン（家族クエスト閲覧、家族メンバー一覧、クエスト詳細、共通コンポーネントなど）
  - **ラベル**: 変更の種類を表す単語（機能追加、新規機能、バグ修正、レイアウト調整、リファクタリングなど）
  - **変更概要**: 具体的な変更内容を一言で

**良いコミットメッセージの例:**
- `共通コンポーネント、レイアウト調整（ページヘッダーのプロフィールアイコンサイズを縮小）`
- `家族プロフィール、レイアウト調整（タイトルを簡潔化）`
- `家族クエスト一覧、バグ修正（完了済みクエストの表示エラーを修正）`
- `タイムライン、新規機能（コメント投稿機能を追加）`
- `スキル管理、機能追加（commit-autoスキルを追加）`

### Step 4: Execute Commit Script

**重要**: `scripts/commit_session_changes.sh`スクリプトを使用してコミットする。このスクリプトは：
- ファイルの存在確認
- **セキュリティチェックの実行（自動）**
- 個別ファイル指定によるステージング（`git add -A`等を使用しない）
- 安全なコミット実行

**実行方法:**
```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh "<ドメイン名>" "<ラベル>" "<変更概要>" <file1> <file2> <file3>...
```

**セキュリティチェックをスキップ（false positiveの場合）:**
```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh --skip-security "<ドメイン名>" "<ラベル>" "<変更概要>" <file1> <file2> <file3>...
```

**例:**
```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh \
  "モック画面管理" \
  "新規機能" \
  "モック画面管理用エージェントを追加" \
  .github/agents/mock-agent.md \
  .github/skills/mock-list/SKILL.md
```

**生成されるコミットメッセージ:**
```
モック画面管理、新規機能（モック画面管理用エージェントを追加）
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
- **Generates commit message from 3 components**: `{ドメイン名}、{ラベル}（{変更概要}）`
- Validates file existence before staging
- **Executes security check automatically**
- Stages only specified files (prevents accidental commits)
- Provides clear feedback at each step
- Exits on any error
- Supports `--skip-security` option for false positives

**Arguments:**
1. Domain name (ドメイン名): e.g., "家族クエスト閲覧", "共通コンポーネント"
2. Label (ラベル): e.g., "新規機能", "バグ修正", "レイアウト調整"
3. Summary (変更概要): e.g., "ページヘッダーのアイコンサイズを縮小"
4. Files: List of files to commit

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
