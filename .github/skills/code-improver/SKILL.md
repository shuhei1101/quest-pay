---
name: code-improver
description: This skill should be used when proposing refactoring options or code improvements. It provides multiple improvement proposals with priorities, implementation difficulty, and impact analysis.
---

# Code Improver

## Overview

このスキルは、既存コードの改善案を複数の選択肢として提案する。リファクタリングや品質向上を検討する際に使用する。

## 使用タイミング

このスキルは以下の場合に使用する:
- コードの改善方法を複数の選択肢から検討したい
- リファクタリングの影響範囲を把握したい
- パフォーマンス、可読性、保守性を向上させたい
- ベストプラクティスとの比較を行いたい

## 提案の構造

改修提案を行う際は、以下の形式で複数の選択肢を提示する:

### 各提案に含める情報

1. **提案名**: 改修内容の簡潔な説明
2. **目的**: この改修で解決する問題や得られるメリット
3. **変更内容**: 具体的な実装の変更点（コード例を含む）
4. **影響範囲**: 変更による影響を受ける部分
5. **優先度**: 高/中/低
6. **実装難易度**: 易/中/難

## 提案パターン

### パターン1: パフォーマンス改善
- 不要な再レンダリングの削減
- メモ化の追加（`useMemo`, `useCallback`）
- 遅延ロードの導入
- バンドルサイズの削減

### パターン2: 可読性向上
- 関数の分割
- 変数名や関数名の改善
- コメントの追加・改善
- マジックナンバーの定数化

### パターン3: 保守性向上
- 型安全性の強化
- エラーハンドリングの追加
- テストの追加
- ドキュメントの改善

### パターン4: アーキテクチャ改善
- 責務の分離（レイアウトコンポーネントへの分離など）
- 依存関係の整理
- デザインパターンの適用
- モジュール構成の最適化

### パターン5: セキュリティ強化
- 入力値検証の追加
- 認証・認可の強化
- XSS/CSRF対策
- 機密情報の保護

## 提案の例

### ユーザーからの依頼
```tsx
以下のコードの改善案を提案してください。

export const QuestList = () => {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/quests')
      .then(res => res.json())
      .then(data => {
        setQuests(data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {quests.map(quest => (
        <div key={quest.id}>
          <h3>{quest.title}</h3>
          <p>{quest.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### 提案の回答例

---

### 提案1: React Queryの導入
**目的**: データ取得ロジックの標準化とキャッシング機能の活用

**変更内容**:
```tsx
export const QuestList = () => {
  const { data: quests, isLoading } = useQuery({
    queryKey: ['quests'],
    queryFn: fetchQuests,
  })
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {quests?.map(quest => (
        <div key={quest.id}>
          <h3>{quest.title}</h3>
          <p>{quest.description}</p>
        </div>
      ))}
    </div>
  )
}
```

**影響範囲**:
- `fetchQuests`をclient.tsに定義する必要がある
- 既存の`useState`と`useEffect`を削除
- React Queryの設定が必要（通常はプロジェクトで既に設定済み）

**優先度**: 高（プロジェクト標準に準拠）  
**実装難易度**: 易

---

### 提案2: エラーハンドリングの追加
**目的**: ネットワークエラーやAPIエラーへの対応

**変更内容**:
```tsx
export const QuestList = () => {
  const { data: quests, isLoading, error } = useQuery({
    queryKey: ['quests'],
    queryFn: fetchQuests,
  })
  
  if (isLoading) return <LoadingOverlay visible />
  if (error) return <ErrorMessage message="クエストの取得に失敗しました" />
  
  return (
    <div>
      {quests?.map(quest => (
        <div key={quest.id}>
          <h3>{quest.title}</h3>
          <p>{quest.description}</p>
        </div>
      ))}
    </div>
  )
}
```

**影響範囲**:
- `LoadingOverlay`と`ErrorMessage`コンポーネントの作成または利用
- MantineUIの`LoadingOverlay`を使用可能

**優先度**: 高（ユーザー体験の向上）  
**実装難易度**: 易

---

### 提案3: レイアウトコンポーネントへの分離
**目的**: プレゼンテーション層の分離とテストの容易化

**変更内容**:
```tsx
// QuestListScreen.tsx
export const QuestListScreen = () => {
  const { data: quests, isLoading, error } = useQuery({
    queryKey: ['quests'],
    queryFn: fetchQuests,
  })
  
  return (
    <QuestListLayout 
      quests={quests}
      isLoading={isLoading}
      error={error}
    />
  )
}

// QuestListLayout.tsx
type Props = {
  quests?: Quest[]
  isLoading: boolean
  error: Error | null
}

export const QuestListLayout = ({ quests, isLoading, error }: Props) => {
  if (isLoading) return <LoadingOverlay visible />
  if (error) return <ErrorMessage message="クエストの取得に失敗しました" />
  
  return (
    <div>
      {quests?.map(quest => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  )
}
```

**影響範囲**:
- 2つのファイルに分割（Screen, Layout）
- `QuestCard`コンポーネントの作成
- プロジェクトのアーキテクチャ標準に準拠

**優先度**: 中（アーキテクチャ標準への準拠）  
**実装難易度**: 中

---

### 提案4: 型安全性の強化
**目的**: TypeScriptの型チェックを活用したバグ防止

**変更内容**:
```tsx
import { Quest } from '@/app/(core)/schema'

export const QuestListScreen = () => {
  const { data: quests, isLoading, error } = useQuery<Quest[]>({
    queryKey: ['quests'],
    queryFn: fetchQuests,
  })
  
  return (
    <QuestListLayout 
      quests={quests}
      isLoading={isLoading}
      error={error}
    />
  )
}
```

**影響範囲**:
- `schema.ts`から`Quest`型をインポート
- APIレスポンスの型定義を追加（client.tsとroute.ts）
- 型の一貫性を確保

**優先度**: 中（型安全性の向上）  
**実装難易度**: 易

---

### 提案5: 空状態の処理
**目的**: クエストが0件の場合のUX改善

**変更内容**:
```tsx
export const QuestListLayout = ({ quests, isLoading, error }: Props) => {
  if (isLoading) return <LoadingOverlay visible />
  if (error) return <ErrorMessage message="クエストの取得に失敗しました" />
  if (!quests || quests.length === 0) {
    return <EmptyState message="まだクエストがありません" />
  }
  
  return (
    <div>
      {quests.map(quest => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  )
}
```

**影響範囲**:
- `EmptyState`コンポーネントの作成または利用
- UI改善によるユーザー体験の向上

**優先度**: 低（UX向上）  
**実装難易度**: 易

---

## 提案の優先順位づけ

複数の提案を行う際は、以下の基準で優先順位をつける:

### 高優先度
- プロジェクト標準への準拠（`coding-standards`, `architecture-guide`）
- セキュリティの問題
- 明らかなバグや不具合
- パフォーマンスの重大な問題
- ユーザー体験に直接影響する問題

### 中優先度
- 保守性の向上
- テストの追加
- ドキュメントの改善
- 軽微なパフォーマンス改善
- コードの可読性向上

### 低優先度
- コードスタイルの統一（機能に影響なし）
- リファクタリング（緊急性なし）
- UI/UXの微調整
- 最適化（現状で問題ない場合）

## 提案数の目安

改善提案を行う際の提案数の目安:

- **シンプルなコード**: 2〜3個の提案
- **中規模なコード**: 3〜5個の提案
- **複雑なコード**: 5〜7個の提案

多すぎる提案は選択を困難にするため、特に重要なものに絞って提示する。

## プロジェクト固有の考慮事項

改修提案を行う際は、以下のプロジェクト固有のルールを考慮する:

1. **コーディング規約**: `coding-standards`スキルに準拠すること
   - セミコロン禁止
   - `type`優先（`interface`は拡張性が必要な場合のみ）
   - Props定義はインライン
   
2. **アーキテクチャ**: `architecture-guide`スキルのパターンに従うこと
   - フロント3層構造（page/screen/layout）
   - API設計（client→route→service/query/db）
   - フックは`useQuery`/`useMutation`を使用
   
3. **DB操作**: `database-operations`スキルのベストプラクティスを適用すること
   - 低レベルクエリの使用
   - 排他制御の実装
   
4. **既存コード**: 既存の実装パターンとの一貫性を保つこと

### scripts/
Executable code (Python/Bash/etc.) that can be run directly to perform specific operations.

**Examples from other skills:**
- PDF skill: `fill_fillable_fields.py`, `extract_form_field_info.py` - utilities for PDF manipulation
- DOCX skill: `document.py`, `utilities.py` - Python modules for document processing

**Appropriate for:** Python scripts, shell scripts, or any executable code that performs automation, data processing, or specific operations.

**Note:** Scripts may be executed without loading into context, but can still be read by Claude for patching or environment adjustments.

### references/
Documentation and reference material intended to be loaded into context to inform Claude's process and thinking.

**Examples from other skills:**
- Product management: `communication.md`, `context_building.md` - detailed workflow guides
- BigQuery: API reference documentation and query examples
- Finance: Schema documentation, company policies

**Appropriate for:** In-depth documentation, API references, database schemas, comprehensive guides, or any detailed information that Claude should reference while working.

### assets/
Files not intended to be loaded into context, but rather used within the output Claude produces.

**Examples from other skills:**
- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
