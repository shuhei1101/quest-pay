import { Box, Button, Checkbox, Group, Switch, Text } from "@mantine/core"
import { useState } from "react"
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form"
import { FamilyQuestFormType } from "../form"

export const OnlineSettings = ({register, watch, setValue}: {
  register: UseFormRegister<FamilyQuestFormType>
  watch: UseFormWatch<FamilyQuestFormType>
  setValue: UseFormSetValue<FamilyQuestFormType>
}) => {
  const isPublicOnline = watch().isPublic

  return (
    <div className="flex flex-col gap-4 max-w-lg p-4">
      <div className="w-fit">
        <Switch 
          label="オンラインに公開する" 
          checked={watch().isPublic}
          onChange={(e) => setValue("isPublic", e.currentTarget.checked)}
        />
      </div>

      {isPublicOnline && (
        <>
          <div className="w-fit">
            <Switch 
              label="依頼者氏名を公開する" 
              description="他の家族があなたのクエストを見た時に依頼者氏名が表示されます"
              checked={watch().isClientPublic}
              onChange={(e) => setValue("isClientPublic", e.currentTarget.checked)}
            />
          </div>

          <div className="w-fit">
            <Switch 
              label="依頼詳細を公開する" 
              description="他の家族があなたのクエストを見た時に依頼詳細が表示されます"
              checked={watch().isRequestDetailPublic}
              onChange={(e) => setValue("isRequestDetailPublic", e.currentTarget.checked)}
            />
          </div>
        </>
      )}
    </div>
  )
}
