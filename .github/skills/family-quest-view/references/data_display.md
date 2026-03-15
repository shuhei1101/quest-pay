# 家族クエスト閲覧画面 - データ表示パターン

**(2026年3月15日 14:30記載)**

## データ取得フック

### useFamilyQuest
**ファイル:** `app/(app)/quests/family/[id]/view/_hooks/useFamilyQuest.ts`

**用途:** 家族クエスト詳細情報を取得

**返り値:**
```typescript
{
  familyQuest: {
    quest: {
      name: string
      iconColor?: string
      client?: string
      requestDetail?: string
      ageFrom?: number
      ageTo?: number
      monthFrom?: number
      monthTo?: number
    }
    icon: {
      name: string
      size: number
    }
    details: Array<{
      level: number
      successCondition: string
      reward: number
      childExp: number
      requiredCompletionCount: number
      requiredClearCount: number | null
    }>
    tags: Array<{
      name: string
    }>
  }
  isLoading: boolean
}
```

**API:** `GET /api/quests/family/[id]`

## 表示データ構造

### ヘッダー情報
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| クエスト名 | `familyQuest.quest.name` | テキスト |
| アイコン | `familyQuest.icon.name` | RenderIcon コンポーネント |
| アイコンサイズ | `familyQuest.icon.size` | 数値（デフォルト: 48） |
| アイコン色 | `familyQuest.quest.iconColor` | カラーコード |

### クエスト条件タブ
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| レベル | `selectedDetail.level` | 数値 |
| 成功条件 | `selectedDetail.successCondition` | テキスト |
| 報酬 | `selectedDetail.reward` | 数値（円） |
| 経験値 | `selectedDetail.childExp` | 数値 |
| 必須完了回数 | `selectedDetail.requiredCompletionCount` | 数値 |
| 前提クリア回数 | `selectedDetail.requiredClearCount` | 数値 または null |
| 対象年齢 | `quest.ageFrom`, `quest.ageTo` | "◯歳〜◯歳" |
| 対象月齢 | `quest.monthFrom`, `quest.monthTo` | "◯ヶ月〜◯ヶ月" |

### 依頼情報タブ
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| クライアント | `familyQuest.quest.client` | テキスト |
| 詳細説明 | `familyQuest.quest.requestDetail` | マルチラインテキスト |

### その他タブ
| 項目 | データソース | 表示形式 |
|------|--------------|----------|
| タグ | `familyQuest.tags` | Chip配列 |

## レベル選択ロジック

### 選択中レベルの決定
```typescript
// デフォルトはレベル1
const [selectedLevel, setSelectedLevel] = useState<number>(1)

// 選択中レベルの詳細を取得
const selectedDetail = familyQuest?.details?.find(d => d.level === selectedLevel) 
  || familyQuest?.details?.[0]

// 利用可能なレベル一覧
const availableLevels = familyQuest?.details
  ?.map(d => d.level)
  .filter((level): level is number => level !== null && level !== undefined) 
  || []
```

### 複数レベル表示条件
- `availableLevels.length > 1` の場合のみレベル選択ボタンを表示
- レベル選択メニューはポップアップで表示

## 子供専用データ

### 子供クエストステータス
| ステータス | 表示 | アクション |
|-----------|------|-----------|
| not_started | 「受注する」ボタン | 受注可能 |
| in_progress | 「完了報告」ボタン | 完了報告可能 |
| pending_review | 「報告キャンセル」ボタン | キャンセル可能 |
| completed | 「完了済み」表示 | アクションなし |

## デフォルト値とフォールバック

### 空データ時の表示
```typescript
questName={familyQuest?.quest?.name || ""}
iconSize={familyQuest?.icon?.size ?? 48}
level={selectedDetail?.level || 1}
reward={selectedDetail?.reward || 0}
exp={selectedDetail?.childExp || 0}
tags={familyQuest?.tags?.map(tag => tag.name) || []}
```

### null チェックと Optional Chaining
- オブジェクトへのアクセスは `?.` を使用
- 配列操作は `|| []` でフォールバック
- 数値は `|| 0` または `?? デフォルト値` を使用
