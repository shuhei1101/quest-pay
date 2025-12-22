import { Box, Button, Checkbox, Group, Switch, Text } from "@mantine/core"
import { useState } from "react"
import { UseFormRegister, UseFormWatch } from "react-hook-form"
import { FamilyQuestFormType } from "../form"

export const OnlineSettings = ({register, watch}: {
  register: UseFormRegister<FamilyQuestFormType>
  watch: UseFormWatch<FamilyQuestFormType>
}) => {
  const isPublicOnline = watch().isPublic

  return (
    <div className="flex flex-col gap-4 max-w-lg p-4">
      <Switch 
        label="オンラインに公開する" 
        {...register("isPublic")}
      />

      {isPublicOnline && (
        <>
          <Switch 
            label="依頼者氏名を公開する" 
            description="他の家族があなたのクエストを見た時に依頼者氏名が表示されます"
            {...register("isClientPublic")}
          />

          <Switch 
            label="依頼詳細を公開する" 
            description="他の家族があなたのクエストを見た時に依頼詳細が表示されます"
            {...register("isRequestDetailPublic")}
          />
        </>
      )}
    </div>
  )
}
