#!/usr/bin/env bash
# モックページ（page.tsx）を生成するスクリプト
#
# Usage:
#   create_mock_page.sh <mock-name> <title> [variant-type]
#
# Arguments:
#   mock-name      : モックディレクトリ名（例: button-test-mock）
#   title          : モック画面のタイトル（例: "ボタンテストモック"）
#   variant-type   : 'single' または 'tabs'（省略時は 'single'）
#
# Examples:
#   create_mock_page.sh button-test-mock "ボタンテストモック"
#   create_mock_page.sh layout-experiment-mock "レイアウト実験モック" tabs

set -e

# 引数チェック
if [ $# -lt 2 ]; then
  echo "❌ Usage: $0 <mock-name> <title> [variant-type]"
  echo ""
  echo "  mock-name      : モックディレクトリ名（例: button-test-mock）"
  echo "  title          : モック画面のタイトル（例: \"ボタンテストモック\"）"
  echo "  variant-type   : 'single' または 'tabs'（省略時は 'single'）"
  exit 1
fi

MOCK_NAME="$1"
TITLE="$2"
VARIANT_TYPE="${3:-single}"

# PascalCase化（簡易版: ハイフンを削除して各単語を大文字化）
COMPONENT_NAME=$(echo "$MOCK_NAME" | sed -e 's/-\([a-z]\)/\U\1/g' -e 's/^\([a-z]\)/\U\1/' -e 's/-//g')

# ワークスペースルートを取得
WORKSPACE_ROOT="/home/shuhei2441/repo/quest-pay/packages/web"
TARGET_DIR="${WORKSPACE_ROOT}/app/test/${MOCK_NAME}"
TARGET_FILE="${TARGET_DIR}/page.tsx"

echo "=== モックページ作成 ==="
echo "モック名: $MOCK_NAME"
echo "タイトル: $TITLE"
echo "タイプ: $VARIANT_TYPE"
echo "コンポーネント名: $COMPONENT_NAME"
echo "保存先: $TARGET_FILE"
echo ""

# ディレクトリ作成
mkdir -p "$TARGET_DIR"

# バリアントタイプに応じてテンプレートを生成
if [ "$VARIANT_TYPE" = "tabs" ]; then
  # タブバリエーションパターン
  cat > "$TARGET_FILE" << 'EOF_TEMPLATE'
"use client"

import { Tabs } from "@mantine/core"
import { useState } from "react"

export default function COMPONENT_NAMEPage() {
  const [activeTab, setActiveTab] = useState<string | null>("variant1")

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">TITLE</h1>
      <p className="text-sm text-gray-600 mb-4">
        複数のデザインバリエーションをタブで切り替えて比較できます
      </p>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="variant1">バリエーション1</Tabs.Tab>
          <Tabs.Tab value="variant2">バリエーション2</Tabs.Tab>
          <Tabs.Tab value="variant3">バリエーション3</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="variant1" pt="md">
          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">バリエーション1: ミニマル</h2>
            <p className="text-gray-600">シンプルで基本的なデザイン</p>
            {/* TODO: バリエーション1の実装 */}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="variant2" pt="md">
          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">バリエーション2: モダン</h2>
            <p className="text-gray-600">洗練された現代的なデザイン</p>
            {/* TODO: バリエーション2の実装 */}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="variant3" pt="md">
          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">バリエーション3: 実験的</h2>
            <p className="text-gray-600">ユニークで特殊効果を含むデザイン</p>
            {/* TODO: バリエーション3の実装 */}
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
EOF_TEMPLATE

  # プレースホルダーを置換
  sed -i "s/COMPONENT_NAME/$COMPONENT_NAME/g" "$TARGET_FILE"
  sed -i "s/TITLE/$TITLE/g" "$TARGET_FILE"

else
  # 単一パターン
  cat > "$TARGET_FILE" << 'EOF_TEMPLATE'
"use client"

export default function COMPONENT_NAMEPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">TITLE</h1>
      {/* TODO: モック内容を実装 */}
      <p className="text-gray-600">モック画面の内容をここに実装してください</p>
    </div>
  )
}
EOF_TEMPLATE

  # プレースホルダーを置換
  sed -i "s/COMPONENT_NAME/$COMPONENT_NAME/g" "$TARGET_FILE"
  sed -i "s/TITLE/$TITLE/g" "$TARGET_FILE"
fi

echo "✓ モックページを作成しました: $TARGET_FILE"
echo ""
echo "次の手順:"
echo "1. endpoints.tsにURL定義を追加"
echo "2. test/page.tsxにモックカードを追加"
echo "3. モック内容を実装"
