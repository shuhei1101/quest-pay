(2026年3月15日 14:30記載)

# QuestEditLayout 使用例

## 基本的な使用例

### 家族クエスト編集

```typescript
<QuestEditLayout<FamilyQuestFormType>
  questId={familyQuestId}
  isLoading={questLoading}
  onSubmit={onSubmit}
  tabs={[
    {
      value: "basic",
      label: "基本設定",
      hasErrors: hasBasicErrors,
      content: (
        <BasicSettings
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          openIconPopup={openIconPopup}
          tagInputValue={tagInputValue}
          setTagInputValue={setTagInputValue}
          handleTag={handleTag}
          isComposing={isComposing}
          setIsComposing={setIsComposing}
        />
      ),
    },
    {
      value: "details",
      label: "詳細設定",
      hasErrors: hasDetailErrors,
      content: (
        <DetailSettings
          activeLevel={activeLevel}
          setActiveLevel={setActiveLevel}
          levels={levels}
          onSave={handleLevelSave}
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
        />
      ),
    },
    {
      value: "children",
      label: "子供設定",
      hasErrors: hasChildErrors,
      content: (
        <ChildSettings
          watch={watch}
          setValue={setValue}
          familyQuestId={familyQuestId}
        />
      ),
    },
  ]}
  editActions={[]}
  createActions={[]}
  fabEditActions={fabEditActions}
  fabCreateActions={fabCreateActions}
  popups={
    <IconSelectPopup
      opened={iconPopupOpened}
      close={closeIconPopup}
      setIcon={(iconId) => setValue("iconId", iconId)}
      setColor={(iconColor) => setValue("iconColor", iconColor)}
      currentIconId={watch().iconId}
      currentColor={watch().iconColor}
    />
  }
/>
```

### FABアクション定義（編集モード）

```typescript
const fabEditActions: FloatingActionItem[] = [
  {
    icon: <IconDeviceFloppy size={20} />,
    label: "保存",
    onClick: () => onSubmit(),
  },
  publicQuest ? {
    icon: <IconExternalLink size={20} />,
    label: "公開中確認",
    onClick: () => router.push(PUBLIC_QUEST_URL(publicQuest.id)),
    color: "violet" as const,
  } : {
    icon: <IconWorld size={20} />,
    label: "公開",
    onClick: () => handlePublish({ familyQuestId: familyQuestId! }),
    color: "green" as const,
  },
  {
    icon: <IconTrash size={20} />,
    label: "削除",
    onClick: () => handleDelete({ 
      familyQuestId: familyQuestId!, 
      updatedAt: fetchedEntity?.base.updatedAt 
    }),
    color: "red" as const,
  },
]
```

### FABアクション定義（新規作成モード）

```typescript
const fabCreateActions: FloatingActionItem[] = [
  {
    icon: <IconDeviceFloppy size={20} />,
    label: "保存",
    onClick: () => onSubmit(),
  },
]
```

### エラーチェック

```typescript
/** 各タブのエラーチェックフラグ */
const hasBasicErrors = !!(
  errors.name || 
  errors.iconId || 
  errors.iconColor || 
  errors.categoryId || 
  errors.tags || 
  errors.client || 
  errors.requestDetail || 
  errors.ageFrom || 
  errors.ageTo || 
  errors.monthFrom || 
  errors.monthTo
)

const hasDetailErrors = !!(errors.details)

const hasChildErrors = !!(errors.childSettings)
```

## 公開クエスト編集の例

```typescript
<QuestEditLayout<PublicQuestFormType>
  questId={publicQuestId}
  isLoading={questLoading}
  onSubmit={onSubmit}
  tabs={[
    {
      value: "basic",
      label: "基本設定",
      hasErrors: hasBasicErrors,
      content: <BasicSettings {...basicSettingsProps} />
    },
    {
      value: "details",
      label: "詳細設定",
      hasErrors: hasDetailErrors,
      content: <DetailSettings {...detailSettingsProps} />
    }
  ]}
  editActions={[
    <Button key="cancel" variant="default" onClick={() => router.back()}>
      キャンセル
    </Button>,
    <Button key="save" type="submit">
      更新
    </Button>
  ]}
  createActions={[
    <Button key="cancel" variant="default" onClick={() => router.back()}>
      キャンセル
    </Button>,
    <Button key="save" type="submit">
      登録
    </Button>
  ]}
  fabEditActions={[
    {
      icon: <IconDeviceFloppy size={20} />,
      label: "保存",
      onClick: () => onSubmit()
    },
    {
      icon: <IconTrash size={20} />,
      label: "削除",
      onClick: () => handleDelete(),
      color: "red" as const
    }
  ]}
  fabCreateActions={[
    {
      icon: <IconDeviceFloppy size={20} />,
      label: "保存",
      onClick: () => onSubmit()
    }
  ]}
/>
```

## テンプレートクエスト編集の例

```typescript
<QuestEditLayout<TemplateQuestFormType>
  questId={templateQuestId}
  isLoading={questLoading}
  onSubmit={onSubmit}
  tabs={[
    {
      value: "basic",
      label: "基本情報",
      hasErrors: hasBasicErrors,
      content: <BasicInfoTab {...basicInfoProps} />
    },
    {
      value: "template",
      label: "テンプレート設定",
      hasErrors: hasTemplateErrors,
      content: <TemplateSettingsTab {...templateSettingsProps} />
    }
  ]}
  editActions={[]}
  createActions={[]}
  fabEditActions={[
    {
      icon: <IconDeviceFloppy size={20} />,
      label: "保存",
      onClick: () => onSubmit()
    }
  ]}
  fabCreateActions={[
    {
      icon: <IconDeviceFloppy size={20} />,
      label: "登録",
      onClick: () => onSubmit()
    }
  ]}
/>
```

## ポップアップの使用例

### アイコン選択ポップアップ

```typescript
popups={
  <IconSelectPopup
    opened={iconPopupOpened}
    close={closeIconPopup}
    setIcon={(iconId) => setValue("iconId", iconId)}
    setColor={(iconColor) => setValue("iconColor", iconColor)}
    currentIconId={watch().iconId}
    currentColor={watch().iconColor}
  />
}
```

### 確認ダイアログ

```typescript
popups={
  <>
    <ConfirmDialog
      opened={deleteConfirmOpened}
      close={closeDeleteConfirm}
      title="削除確認"
      message="このクエストを削除してもよろしいですか？"
      onConfirm={handleDeleteConfirm}
    />
    <IconSelectPopup {...iconSelectProps} />
  </>
}
```

## フォーム送信ハンドラー

```typescript
/** フォーム送信ハンドル */
const onSubmit = handleSubmit((form) => {
  if (familyQuestId) {
    // 更新処理
    handleUpdate({ 
      form, 
      familyQuestId, 
      updatedAt: fetchedEntity?.base.updatedAt, 
      questUpdatedAt: fetchedEntity?.quest.updatedAt 
    })
  } else {
    // 新規作成処理
    handleRegister({ form })
  }
})
```

## タブ内容のスクロール制御

詳細設定タブは自身でスクロール制御するため、レイアウト側で`overflowY: hidden`を指定:

```typescript
{
  value: "details",
  label: "詳細設定",
  hasErrors: hasDetailErrors,
  content: (
    <Box style={{ height: '100%', overflowY: 'auto' }}>
      <DetailSettings {...detailSettingsProps} />
    </Box>
  )
}
```
