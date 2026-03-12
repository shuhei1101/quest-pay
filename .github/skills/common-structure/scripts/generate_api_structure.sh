#!/bin/bash
# APIエンドポイント構造を自動生成するスクリプト
# 使用方法: bash generate_api_structure.sh <api-path>

if [ -z "$1" ]; then
  echo "使用方法: bash generate_api_structure.sh <api-path>"
  echo "例: bash generate_api_structure.sh app/api/families"
  exit 1
fi

API_PATH="$1"
BASE_PATH="/home/shuhei2441/repo/quest-pay/packages/web"
FULL_PATH="$BASE_PATH/$API_PATH"

if [ ! -d "$FULL_PATH" ]; then
  echo "エラー: ディレクトリが存在しません: $FULL_PATH"
  exit 1
fi

echo "# API構造: $API_PATH"
echo ""

# エンドポイント一覧
echo "## エンドポイント一覧"
echo ""
find "$FULL_PATH" -name "route.ts" | while read -r file; do
  REL_PATH=$(echo "$file" | sed "s|$BASE_PATH/||" | sed 's|/route.ts$||')
  ENDPOINT_PATH=$(echo "$REL_PATH" | sed 's|app/api||')
  
  echo "### \`$ENDPOINT_PATH\`"
  
  # HTTP メソッドを検出
  METHODS=$(grep -oP 'export\s+(async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)' "$file" | awk '{print $NF}' | sort | tr '\n' ', ' | sed 's/,$//')
  
  if [ -n "$METHODS" ]; then
    echo "- **メソッド**: $METHODS"
  fi
  
  # ファイルパス
  echo "- **ファイル**: \`$REL_PATH/route.ts\`"
  echo ""
done

echo "## 生成日時"
echo "$(date '+%Y-%m-%d %H:%M:%S')"
