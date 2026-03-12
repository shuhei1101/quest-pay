#!/bin/bash
# 画面構造を自動生成するスクリプト
# 使用方法: bash generate_screen_structure.sh <screen-path>

if [ -z "$1" ]; then
  echo "使用方法: bash generate_screen_structure.sh <screen-path>"
  echo "例: bash generate_screen_structure.sh app/(app)/families"
  exit 1
fi

SCREEN_PATH="$1"
BASE_PATH="/home/shuhei2441/repo/quest-pay/packages/web"
FULL_PATH="$BASE_PATH/$SCREEN_PATH"

if [ ! -d "$FULL_PATH" ]; then
  echo "エラー: ディレクトリが存在しません: $FULL_PATH"
  exit 1
fi

echo "# 画面構造: $SCREEN_PATH"
echo ""

# ファイル構成
echo "## ファイル構成"
echo ""
echo '```'
find "$FULL_PATH" -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*" | sed "s|$BASE_PATH/||" | sort
echo '```'
echo ""

# メインファイル
if [ -f "$FULL_PATH/page.tsx" ]; then
  echo "## メインファイル"
  echo "- \`$SCREEN_PATH/page.tsx\`: ページエントリーポイント"
  
  # Screen コンポーネントを検索
  SCREEN_FILE=$(find "$FULL_PATH" -name "*Screen.tsx" | head -1)
  if [ -n "$SCREEN_FILE" ]; then
    echo "- \`$(echo "$SCREEN_FILE" | sed "s|$BASE_PATH/||")\`: メイン画面実装"
  fi
  echo ""
fi

# コンポーネント
if [ -d "$FULL_PATH/_components" ]; then
  echo "## コンポーネント"
  find "$FULL_PATH/_components" -name "*.tsx" | while read -r file; do
    COMPONENT=$(basename "$file" .tsx)
    REL_PATH=$(echo "$file" | sed "s|$BASE_PATH/||")
    echo "- \`$REL_PATH\`: $COMPONENT コンポーネント"
  done
  echo ""
fi

# フック
if [ -d "$FULL_PATH/_hooks" ]; then
  echo "## フック"
  find "$FULL_PATH/_hooks" -name "*.ts" -o -name "*.tsx" | while read -r file; do
    HOOK=$(basename "$file" | sed 's/\.[^.]*$//')
    REL_PATH=$(echo "$file" | sed "s|$BASE_PATH/||")
    echo "- \`$REL_PATH\`: $HOOK フック"
  done
  echo ""
fi

# API エンドポイント候補を検索
SCREEN_NAME=$(basename "$SCREEN_PATH")
echo "## 関連APIエンドポイント候補"
API_PATH="$BASE_PATH/app/api/$SCREEN_NAME"
if [ -d "$API_PATH" ]; then
  find "$API_PATH" -name "route.ts" | while read -r file; do
    REL_PATH=$(echo "$file" | sed "s|$BASE_PATH/||" | sed 's|/route.ts$||')
    echo "- \`$REL_PATH\`: API エンドポイント"
  done
else
  echo "（APIディレクトリが見つかりません: app/api/$SCREEN_NAME）"
fi
echo ""

echo "## 生成日時"
echo "$(date '+%Y-%m-%d %H:%M:%S')"
