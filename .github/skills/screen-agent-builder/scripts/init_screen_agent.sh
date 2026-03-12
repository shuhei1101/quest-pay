#!/usr/bin/env bash
# 画面エージェントとスキル群を初期化するスクリプト
#
# Usage:
#   init_screen_agent.sh <screen-name> <screen-title> [skill-types...]
#
# Arguments:
#   screen-name   : 画面の識別名（例: family-quest, public-quest）
#   screen-title  : 画面の表示名（例: "家族クエスト", "公開クエスト"）
#   skill-types   : スキルタイプをスペース区切りで指定（例: list view edit api）
#
# Examples:
#   init_screen_agent.sh family-quest "家族クエスト" list view edit api
#   init_screen_agent.sh home "ホーム" structure api

set -e

# 引数チェック
if [ $# -lt 2 ]; then
  echo "❌ Usage: $0 <screen-name> <screen-title> [skill-types...]"
  echo ""
  echo "  screen-name   : 画面の識別名（例: family-quest, public-quest）"
  echo "  screen-title  : 画面の表示名（例: \"家族クエスト\"）"
  echo "  skill-types   : スキルタイプ（例: list view edit api structure）"
  exit 1
fi

SCREEN_NAME="$1"
SCREEN_TITLE="$2"
shift 2
SKILL_TYPES=("$@")

# デフォルトのスキルタイプ（指定がない場合）
if [ ${#SKILL_TYPES[@]} -eq 0 ]; then
  SKILL_TYPES=("structure" "api")
fi

# ワークスペースルート
WORKSPACE_ROOT="/home/shuhei2441/repo/quest-pay"
AGENT_FILE="${WORKSPACE_ROOT}/.github/agents/${SCREEN_NAME}-agent.md"
SKILLS_DIR="${WORKSPACE_ROOT}/.github/skills"
INIT_SKILL_SCRIPT="${WORKSPACE_ROOT}/.github/skills/skill-creator/scripts/init_skill.py"

echo "=== 画面エージェント初期化 ==="
echo "画面名: $SCREEN_NAME"
echo "タイトル: $SCREEN_TITLE"
echo "スキルタイプ: ${SKILL_TYPES[*]}"
echo ""

# Step 1: スキル群を作成
echo "=== Step 1: スキル群の作成 ==="
SKILL_LIST=""
for skill_type in "${SKILL_TYPES[@]}"; do
  SKILL_NAME="${SCREEN_NAME}-${skill_type}"
  echo "  ✓ スキルを初期化: ${SKILL_NAME}"
  
  if [ -d "${SKILLS_DIR}/${SKILL_NAME}" ]; then
    echo "    ⚠️  スキルディレクトリが既に存在します: ${SKILL_NAME}"
  else
    python3 "$INIT_SKILL_SCRIPT" "$SKILL_NAME" --path "$SKILLS_DIR"
    echo "    ✓ スキルを作成しました: ${SKILL_NAME}"
  fi
  
  # スキルリストに追加
  if [ -z "$SKILL_LIST" ]; then
    SKILL_LIST="- \`${SKILL_NAME}\`: ${SCREEN_TITLE}${skill_type}に関する知識"
  else
    SKILL_LIST="${SKILL_LIST}\n- \`${SKILL_NAME}\`: ${SCREEN_TITLE}${skill_type}に関する知識"
  fi
done
echo ""

# Step 2: エージェントファイルを作成
echo "=== Step 2: エージェントファイルの作成 ==="
if [ -f "$AGENT_FILE" ]; then
  echo "⚠️  エージェントファイルが既に存在します: $AGENT_FILE"
  echo "    既存のファイルは上書きされません"
else
  cat > "$AGENT_FILE" << 'EOF_AGENT'
---
description: SCREEN_TITLE画面を管理するエージェント。機能改修、機能説明、スキルアップデートを担当。
name: SCREEN_NAME-agent
argument-hint: '改修内容、説明したい項目、またはアップデート指示を入力してください'
model: Claude Sonnet 4.5
---

# SCREEN_TITLE Agent

あなたは**SCREEN_TITLE画面**を専門に管理するエージェントだ。
この画面に関連するすべてのパス、コンポーネント、API、レイアウトを熟知している。

## 担当スキル

以下のスキルを保持し、必要に応じて参照・更新する：
SKILL_LIST

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

### 機能説明時
1. 説明対象を特定
2. 関連するスキルを参照
3. 構造・フロー・ファイルを説明

### スキルアップデート時
1. 担当スキルを読み込む
2. 現在のフォルダ構造を確認
3. 差分を特定
4. スキルを更新

## 共通利用可能スキル

以下のスキルは全画面で共通して利用可能：
- `coding-standards`: コーディング規約
- `architecture-guide`: アーキテクチャガイド
- `database-operations`: DB操作ガイド
- `endpoints-definition`: エンドポイント定義
- `error-handling`: エラーハンドリング
- `common-components-catalog`: 共通コンポーネント一覧
- `common-components-usage`: 共通コンポーネント使用方法

## 制約

- **範囲外の作業はしない**: この画面に関連しない機能修正は他のエージェントに委譲
- **規約遵守**: `coding-standards`、`architecture-guide`、`database-operations` を必ず参照
- **スキル優先**: 実装前に必ず関連スキルを参照して現在の構造を理解
EOF_AGENT

  # プレースホルダーを置換
  sed -i "s/SCREEN_NAME/$SCREEN_NAME/g" "$AGENT_FILE"
  sed -i "s/SCREEN_TITLE/$SCREEN_TITLE/g" "$AGENT_FILE"
  sed -i "s|SKILL_LIST|$SKILL_LIST|g" "$AGENT_FILE"

  echo "✓ エージェントファイルを作成しました: $AGENT_FILE"
fi

echo ""
echo "=== 完了 ==="
echo "次の手順:"
echo "1. 各スキルのSKILL.mdを編集して構造知識を追加"
echo "2. エージェントファイルを確認・調整"
echo "3. .github/copilot-instructions.mdのAGENTS.mdセクションを更新"
