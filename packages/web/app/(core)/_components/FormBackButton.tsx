import { Button } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useTheme } from "@/app/(core)/_theme/useTheme"

export const FormBackButton = ({isValueChanged, previousScreenURL}: {
  isValueChanged: boolean,
  previousScreenURL: string
}) => {
  /** テーマ情報 */
  const { colors } = useTheme()

  const onClick = () => {
    if (isValueChanged) {
      const isOk = window.confirm(
        "入力内容が破棄されますがよろしいですか？"
      )
      if (isOk) router.push(previousScreenURL)
    } else {
      router.push(previousScreenURL)
    }
  }

  const router = useRouter()
  return (
    <Button variant="outline" onClick={onClick} color={colors.buttonColors.default}>閉じる</Button>
  )
}
