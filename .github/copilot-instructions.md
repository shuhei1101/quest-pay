# アプリ概要
- アプリ名: `お小遣いクエストボード`
- アプリ概要: 
  - 親がクエストを登録し、子供がそのクエストを実行するとお小遣いが貰える仕組みをシステム化
  - オンライン機能により、世界中の家族が自身のクエストを共有できる
- ユーザタイプ:
  - 親: クエストの登録や編集、家族情報の変更、オンラインの公開クエストの閲覧が可能
  - 子供: 家族クエストの閲覧、受注が可能
- 技術:
  - フロントエンド: `Next.js`
    - UIコンポーネントライブラリ: `MantineUI`
  - バックエンド: `Next.js`
  - DB: `Supabase`
- 備考:
  - DB接続はSupabase Clientを使用
  - 複数テーブルの更新はSupabaseの`Database Functions`を使用
  - 基本的にバックエンド側は人間が作成し、フロントエンド部分をAIが担当する

# コーディングルール
## 全般
- 文末のセミコロンはつけないこと`;`
- YAGNI原則に従い、不要な分割や共通化は避けること（例えば、関数の引数の型をその場でしか使わないにも関わらず、typeでXxxParamsと定義したりすることはNG。必要になった際に定義しなおすこと）

## 型
- `entity.ts`ファイルにZodスキーマの型を共有しているため、必要であればこちらを利用すること（間違っても同じような型を生成しないこと）
- DBのカラムと同じ意味の変数や引数を定義するときは、`entity.ts`の型内を参照すること。（もしくはUnionを使用）（Entity定義を変えたときに自動で変わるように）
  - 例: 
```ts
type QuestItem = {
  id: QuestEntity["id"]
  category_id?: QuestEntity["category_id"]
  [key: string]: any
}
```

## typeとinterface
- 理由がない場合、typeを使用すること

## 関数
- 理由がない場合、functionではなく、constを使用すること

## JSX(tsxファイル)
- 理由がない場合、functionではなく、constを使用すること
  - export defaultの場合のみfunctionを使う（page.tsxなど）
- Props部分は理由がない場合、分割してexportせず、直接引数部分（インライン）に書くこと
  - 例:
```tsx
/** 子供登録フォームを取得する */
export const useChildForm = ({childId}: {childId?: string}) => {
  const router = useRouter()
```

- フローティング部品は親JSX要素の一番下に配置すること（ポップアップ部品やフローティングボタン等）

## コメント
- 関数や関数呼び出しのコメントは名詞系で終わらせず、`~する`のような形式にすること
  - 例: `親情報を取得する。`, `画面を閉じる`など
- JSX内のコンポーネントには細かくコメントを入れること。（ただし、コードの横には極力コメントを書かないこと。）
  - 例:
```tsx
        <Box pos="relative" className="max-w-120">
          {/* ロード中のオーバーレイ */}
          <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
          {/* 子供入力フォーム */}
          <form onSubmit={handleSubmit((form) => handleRegister({form}))}>
            {/* 入力欄のコンテナ */}
            <div className="flex flex-col gap-2">
              {/* 子供名入力欄 */}
              <div>
              ...
```
