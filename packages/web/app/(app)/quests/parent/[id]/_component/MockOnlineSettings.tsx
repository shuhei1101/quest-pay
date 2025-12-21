import { Box, Button, Checkbox, Group, Switch, Text } from "@mantine/core"
import { useState } from "react"

export const MockOnlineSettingsA = () => {
  const [isPublicOnline, setIsPublicOnline] = useState(false)

  return (
    <div className="flex flex-col gap-4 max-w-lg p-4">
      <Switch 
        label="オンラインに公開する" 
        checked={isPublicOnline}
        onChange={(e) => setIsPublicOnline(e.currentTarget.checked)}
      />

      {isPublicOnline && (
        <>
          <Switch 
            label="依頼者氏名を公開する" 
            description="他の家族があなたのクエストを見た時に依頼者氏名が表示されます"
          />

          <Switch 
            label="依頼詳細を公開する" 
            description="他の家族があなたのクエストを見た時に依頼詳細が表示されます"
          />
        </>
      )}
    </div>
  )
}
