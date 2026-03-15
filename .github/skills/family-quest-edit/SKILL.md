---
name: family-quest-edit
description: 家族クエスト編集画面の構造知識を提供するスキル。ファイル構成、フォーム管理、バリデーション、処理フローを含む。
---

# 家族クエスト編集 スキル

## 概要

このスキルは、家族クエストの作成・更新を行う編集画面の知識を提供します。基本設定、レベル別詳細設定、子供設定の3つのタブで構成され、複雑なフォーム管理とレベル動的管理を実現します。

## メインソースファイル

### ページ
- `app/(app)/quests/family/[id]/page.tsx`: 編集ページ（リダイレクト専用）
- `app/(app)/quests/family/[id]/FamilyQuestEdit.tsx`: 編集画面のメイン実装
- `app/(app)/quests/family/new/page.tsx`: 新規作成ページ（リダイレクト専用）

### コンポーネント
- `_components/BasicSettings.tsx`: 基本設定タブ
- `_components/DetailSettings.tsx`: 詳細設定（レベル別）タブ
- `_components/ChildSettings.tsx`: 子供設定タブ
- `_components/LevelDetailForm.tsx`: レベル別詳細フォーム
- `_components/LevelCopyButton.tsx`: レベルコピーボタン

### フック
- `_hooks/useFamilyQuestForm.ts`: フォーム状態管理
- `_hooks/useRegisterFamilyQuest.ts`: 新規作成
- `_hooks/useUpdateFamilyQuest.ts`: 更新
- `_hooks/useDeleteFamilyQuest.ts`: 削除
- `_hooks/usePublishFamilyQuest.ts`: 公開
- `_hooks/usePublicQuest.ts`: 公開クエスト取得

### フォームスキーマ
- `form.ts`: FamilyQuestFormSchema、ChildSettingSchema (Zod)
- `../../form.ts`: BaseQuestFormScheme、QuestDetailScheme (継承元)

### レイアウト
- `../../_components/QuestEditLayout.tsx`: クエスト編集共通レイアウト

### データベース
- `drizzle/schema.ts`: family_quests, family_quest_details, child_quests, public_quests

## 主要機能グループ

### 1. 基本設定管理
- クエスト名、アイコン、カテゴリ、タグ、依頼情報
- 対象年齢、公開時期の設定

### 2. レベル別詳細設定
- 動的なレベル管理（1〜5レベル、追加・削除可能）
- 達成条件、必要クリア回数、報酬、経験値、必要完了回数
- レベル間のデータコピー機能

### 3. 子供設定
- 子供ごとの公開/非公開切り替え
- 子供クエスト画面へのリンク

### 4. データ永続化
- 新規作成: POST /api/quests/family
- 更新 (楽観的ロック): PUT /api/quests/family/[id]
- 削除 (楽観的ロック): DELETE /api/quests/family/[id]
- 公開: POST /api/quests/family/[id]/publish
- React Query によるキャッシュ管理

### 5. セッションストレージ
- 画面遷移時のフォーム状態保持
- appStorage.familyQuestForm による復元

## Reference Files Usage

### コンポーネント構造を把握する場合
画面階層、3つのタブ構成、FABアクション、レイアウトを確認：
```
references/component_structure.md
```

### フォーム管理を理解する場合
スキーマ定義（ベース継承、カスタムリファインメント）、状態管理、送信処理、レベル管理、子供設定を確認：
```
references/form_management.md
```

### 画面フローを理解する場合
新規作成・更新・削除・公開フロー、レベル管理、タグ入力、エラーハンドリングを確認：
```
references/flow_diagram.md
```

### バリデーションルールを確認する場合
基本設定・詳細設定・子供設定のフィールド別制約、カスタムバリデーション、エラー表示を確認：
```
references/validation_rules.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md` で新規作成・更新フロー確認
2. **フォーム理解**: `references/form_management.md` で複雑なフォームスキーマと管理方法確認
3. **実装時**: `references/component_structure.md` でタブ構成とコンポーネント階層確認
4. **バリデーション追加時**: `references/validation_rules.md` で詳細な制約ルール確認

## 実装上の注意点

### 必須パターン

1. **認証制御**
   - 親ユーザーのみアクセス可能
   - authGuard で childNG, guestNG を設定

2. **フォーム状態管理**
   - useFamilyQuestForm でフォーム状態を一元管理
   - BaseQuestFormScheme を継承して ChildSettings を追加

3. **レベル管理の動的制御**
   - 最低1レベル、最大5レベル
   - レベル追加時は既存レベルを繰り上げ
   - レベル削除時は既存レベルを繰り下げ
   - デフォルト値のレベルは確認なしで削除

4. **楽観的ロック**
   - 更新・削除時に updatedAt, questUpdatedAt を送信
   - 競合時は409エラー、トースト表示、データ再取得

5. **セッションストレージ統合**
   - 起動時に appStorage.familyQuestForm.pop() でフォーム復元
   - 画面遷移前にフォーム状態を保存

6. **タブエラー表示**
   - 各タブにエラーフラグを設定
   - エラーがあるタブに赤いバッジ表示

7. **FABアクション分岐**
   - 編集モード: 保存、公開（または公開中確認）、削除
   - 新規作成モード: 保存のみ

### アンチパターン（避けるべき実装）

❌ **レベル管理の不整合**
```typescript
// NG: レベルを削除後、番号を詰めない
const handleRemoveLevel = () => {
  setValue("details", details.filter(d => d.level !== currentLevel))
  // レベル2を削除した場合、レベル1, レベル3... となり不整合
}
```

❌ **楽観的ロックの省略**
```typescript
// NG: updatedAt を送信しない
await updateFamilyQuest({ form, familyQuestId })
// 競合検知ができず、データ破壊の可能性
```

❌ **タグ入力でIME制御忘れ**
```typescript
// NG: IME入力中もEnterキーを処理
onKeyDown={(e) => {
  if (e.key === "Enter") {
    handleTag() // IME確定がタグ追加されてしまう
  }
}}
```

### よくある実装ミス

1. **新規作成後にIDが更新されない**
   - `setId` を useRegisterFamilyQuest に渡し忘れ
   - 編集画面への遷移が失敗

2. **レベル5で必要クリア回数がnullにならない**
   - レベル5追加時に requiredClearCount を null に設定し忘れ

3. **子供設定の削除タイミング誤り**
   - hasQuestChildren=true の設定を削除してしまう
   - 子供クエストが存在する場合は isActivate のみ切り替え

4. **LoadingOverlay の条件不足**
   - questLoading のみチェックし、送信中のローディングを表示しない

5. **タブエラーチェックの漏れ**
   - 一部のエラーフィールドをタブエラーフラグに含めない

## エンドポイント

### 画面URL
- `FAMILY_QUEST_EDIT_URL(familyQuestId)`: 家族クエスト編集画面
- `FAMILY_QUEST_NEW_URL`: 新規家族クエスト作成画面
- `FAMILY_QUEST_VIEW_URL(familyQuestId)`: 家族クエスト閲覧画面
- `PUBLIC_QUEST_URL(publicQuestId)`: 公開クエスト画面

### API
- `GET /api/quests/family/[id]`: 家族クエストデータ取得
- `POST /api/quests/family`: 新規作成
- `PUT /api/quests/family/[id]`: 更新
- `DELETE /api/quests/family/[id]`: 削除
- `POST /api/quests/family/[id]/publish`: 公開
