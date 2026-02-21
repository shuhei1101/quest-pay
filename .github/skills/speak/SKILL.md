---
name: speak
description: This skill should be used when completing tasks to notify users with voice synthesis. It automatically announces task completion with a brief summary, providing immediate audio feedback through the MCP yomiage tool.
---

# Speak

## Overview

Use the MCP yomiage tool to provide voice notifications when tasks are completed. This creates an immediate, accessible way for users to know when work is done, especially useful during long-running operations or when users are multitasking.

## When to Use

**必須実行タイミング（Mandatory triggers）:**
- ✅ **ユーザーから依頼された作業が完了したとき**（すべてのタスク完了時）
- ✅ なんらかの成果物を作成・変更したとき
- ✅ 依頼された処理が終了したとき

**実行しない場合（Do NOT use）:**
- ❌ タスク開始時（Task initiation）
- ❌ 進捗報告のみ（Progress updates only）
- ❌ エラー発生時のみの報告（Error occurrences - unless task is terminated）
- ❌ ユーザーへの質問時（When asking clarifying questions）
- ❌ 情報提供のみの場合（Informational responses without actions）

## Usage

### Basic Pattern

When a task is completed, immediately invoke the MCP yomiage tool with a brief summary:

```
# After completing a task successfully
mcp_yomiage_speak(
  text="タスクが完了しました"
)
```

### Message Guidelines

**メッセージ作成ルール（Message creation rules）:**

1. **簡潔性（Brevity）**: 一文程度（10〜20文字）で要点をまとめる
   - ✅ 良い例: "ファイルを作成しました"
   - ✅ 良い例: "修正が完了しました"
   - ❌ 悪い例: "先ほどご依頼いただいたファイルの作成作業が無事に完了いたしました"

2. **具体性（Specificity）**: 何が完了したかを明示する
   - ✅ 良い例: "コードレビューが完了しました"
   - ✅ 良い例: "テストが完了しました"
   - ❌ 悪い例: "作業が完了しました"（何の作業か不明）

3. **口調（Tone）**: 丁寧かつ簡潔な日本語
   - ✅ 良い例: "スキルを作成しました"
   - ❌ 悪い例: "スキル作ったよ"（カジュアルすぎる）

4. **タイミング（Timing）**: タスク完了直後
   - ✅ 実装完了 → すぐに音声通知
   - ❌ すべての説明を書いた後に音声通知（遅すぎる）

### Available Speakers

利用可能な話者（デフォルトは `zundamon`）:
- `zundamon` - ずんだもん（デフォルト）
- `tsumugi` - 春日部つむぎ
- `metan` - 四国めたん

話者を指定する場合:
```
mcp_yomiage_speak(
  text="完了しました",
  speaker="tsumugi"
)
```

### Common Examples

**ファイル作成:**
```
mcp_yomiage_speak(text="ファイルを作成しました")
```

**コード修正:**
```
mcp_yomiage_speak(text="修正が完了しました")
```

**テスト実行:**
```
mcp_yomiage_speak(text="テストが完了しました")
```

**スキル作成:**
```
mcp_yomiage_speak(text="スキルを作成しました")
```

**エラー時（タスク終了の場合のみ）:**
```
mcp_yomiage_speak(text="エラーが発生しました")
```

## Important Rules

### 必ず守ること（Must follow）:
- **即座に通知**: タスク完了直後に音声通知を実行する
- **簡潔なメッセージ**: 一文程度（10〜20文字）で要点をまとめる
- **具体的な内容**: 何が完了したかを明示する
- **日本語のみ**: メッセージは必ず日本語で作成する

### してはいけないこと（Must NOT do）:
- **長文での通知**: 複数文や詳細な説明を含めない
- **通知の省略**: 必須タイミングで音声通知を忘れない
- **不適切なタイミング**: 進捗報告や質問時に通知しない
- **英語での通知**: 日本語のみを使用する

## Integration with Task Workflow

タスク完了フロー（Task completion flow）:

1. ユーザーからタスクを受け取る
2. タスクを実行（ファイル作成、コード修正など）
3. **音声で完了報告（必須）** ← これを忘れないこと！
4. テキストで結果を報告

Example:
```
# Step 2: Task execution
create_file(...)

# Step 3: Voice notification (MANDATORY)
mcp_yomiage_speak(text="ファイルを作成しました")

# Step 4: Text report
"新しいファイルを作成しました: path/to/file.ts"
```
