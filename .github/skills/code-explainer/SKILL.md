---
name: code-explainer
description: This skill should be used when explaining existing code's purpose, structure, and implementation details. It provides structured code analysis with focus on understanding the design intent and execution flow.
---

# Code Explainer

## Overview

このスキルは、既存コードの詳細な解説を提供する。コードの動作や設計意図を理解したい場合に使用する。

## 使用タイミング

このスキルは以下の場合に使用する:
- 既存コードの動作を理解したい
- コードの設計意図を把握したい
- 処理フローを順を追って理解したい
- 依存関係やアーキテクチャを確認したい

## 解説の構造

コードを解説する際は、以下の構造で説明する:

### 1. 目的
コードが何を実現しようとしているかを明確に説明する。

### 2. 構造
主要な構成要素とその関係性を説明する。
- 使用しているフック、コンポーネント、関数
- それぞれの役割と責務
- データの流れ

### 3. 処理フロー
実行の流れを順を追って説明する。
- 初期化処理
- メインロジック
- 副作用や非同期処理
- エラーハンドリング

### 4. 重要なポイント
特に注意すべき実装や設計判断を強調する。
- パフォーマンスに関わる実装
- セキュリティ上の考慮
- エッジケースの処理
- デザインパターンの適用

### 5. 依存関係
他のモジュールやライブラリとの関連性を説明する。
- 外部ライブラリ
- プロジェクト内の他モジュール
- API呼び出し
- 環境依存の要素

## 解説の例

### 例1: フックの解説

**ユーザーからの質問**:
```tsx
この関数の動作を説明してください。

export const useQuestForm = ({questId}: {questId?: string}) => {
  const router = useRouter()
  const { mutate, isPending } = useMutation({
    mutationFn: questId ? updateQuest : createQuest,
    onSuccess: () => router.push('/quests'),
  })
  
  const form = useForm({
    defaultValues: async () => {
      if (!questId) return { title: '', description: '' }
      const quest = await fetchQuest(questId)
      return quest
    }
  })
  
  return { form, mutate, isPending }
}
```

**解説の回答例**:

**目的**:
このフックはクエストの作成・編集フォームを管理する。新規作成と既存データの編集の両方に対応している。

**構造**:
- `useRouter`: 画面遷移の制御を担当
- `useMutation`: API呼び出しと成功時の処理を管理
- `useForm`: フォーム状態の管理とバリデーションを実行

**処理フロー**:
1. `questId`の有無で新規作成か編集かを判定
2. 編集の場合、`defaultValues`で既存データを非同期取得
3. フォーム送信時、`mutate`が適切なAPI（create/update）を呼び出し
4. API呼び出し成功時、クエスト一覧画面（`/quests`）にリダイレクト

**重要なポイント**:
- `mutationFn`の動的切り替えにより、コード重複を回避している
- `defaultValues`を非同期関数にすることで、編集時のデータ取得を実現
- `isPending`を返すことで、呼び出し側でローディング状態を管理可能にしている
- 成功時のリダイレクトにより、ユーザー体験を向上させている

**依存関係**:
- `@tanstack/react-query`の`useMutation`: データ変更とキャッシュ管理
- `react-hook-form`の`useForm`: フォーム状態管理
- Next.jsの`useRouter`: クライアントサイドルーティング
- APIクライアント関数:
  - `updateQuest`: クエスト更新API
  - `createQuest`: クエスト作成API
  - `fetchQuest`: クエスト取得API

### 例2: コンポーネントの解説

**ユーザーからの質問**:
```tsx
このコンポーネントの動作を説明してください。

export const QuestCard = ({ quest, onComplete }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <Card>
      <Card.Section onClick={() => setIsExpanded(!isExpanded)}>
        <Group justify="space-between">
          <Text fw={500}>{quest.title}</Text>
          <Badge>{quest.reward}円</Badge>
        </Group>
      </Card.Section>
      
      <Collapse in={isExpanded}>
        <Card.Section>
          <Text size="sm">{quest.description}</Text>
          <Button onClick={() => onComplete(quest.id)}>
            完了報告
          </Button>
        </Card.Section>
      </Collapse>
    </Card>
  )
}
```

**解説の回答例**:

**目的**:
クエスト情報を表示し、ユーザーがクエストの詳細を確認して完了報告できるUIコンポーネントを提供する。

**構造**:
- `Card`: MantineUIのカードコンポーネント（外枠）
- `isExpanded`: 詳細表示の開閉状態を管理
- `Group`: タイトルと報酬を横並びで配置
- `Collapse`: アニメーション付きで詳細を表示/非表示

**処理フロー**:
1. 初期状態では詳細は非表示（`isExpanded = false`）
2. カードのヘッダー部分をクリックすると、`isExpanded`がトグルされる
3. `Collapse`コンポーネントが`isExpanded`に応じて詳細を表示/非表示
4. 完了報告ボタンをクリックすると、親コンポーネントから渡された`onComplete`が実行される

**重要なポイント**:
- アコーディオン形式により、画面スペースを効率的に使用
- クリック範囲が`Card.Section`全体のため、UXが向上
- 報酬額を`Badge`で目立たせることで、モチベーション向上を図っている
- `onComplete`をpropsで受け取ることで、コンポーネントの再利用性を確保

**依存関係**:
- MantineUI コンポーネント:
  - `Card`, `Card.Section`: カードレイアウト
  - `Group`: フレックスボックスレイアウト
  - `Text`: テキスト表示
  - `Badge`: バッジ表示
  - `Button`: ボタン
  - `Collapse`: アニメーション付き開閉
- `React.useState`: ローカル状態管理
- `Props.quest`: 親から渡されるクエストデータ
- `Props.onComplete`: 親から渡される完了処理関数

## プロジェクト固有の考慮事項

コードを解説する際は、以下のプロジェクト固有のルールを踏まえて説明する:

1. **コーディング規約**: `coding-standards`スキルの規約に従って記述されているかを確認
2. **アーキテクチャ**: `architecture-guide`スキルのパターンに沿っているかを確認
3. **DB操作**: `database-operations`スキルのベストプラクティスが適用されているかを確認
4. **命名規則**: 日本語コメント、動詞形式のコメント、セミコロン禁止などの確認

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
