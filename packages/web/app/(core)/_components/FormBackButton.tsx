import { Button } from "@mantine/core"
import { useRouter } from "@/app/(core)/_hooks/useRouter"

export const FormBackButton = ({isValueChanged, previousScreenURL}: {
  isValueChanged: boolean,
  previousScreenURL: string
}) => {
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
    <Button variant="outline" onClick={onClick}>閉じる</Button>
  )
}
