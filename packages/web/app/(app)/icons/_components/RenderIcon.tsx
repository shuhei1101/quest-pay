import { IconQuestionMark } from "@tabler/icons-react"
import React from "react"
import * as FaIcons from "react-icons/fa";
import * as TbIcons from "react-icons/tb";
import * as TablerIcons from '@tabler/icons-react';

/** レンダリングされたアイコン */
export const RenderIcon = ({iconName, iconSize, iconColor, ...props}: { 
  iconName?: string,
  iconSize?: number | null,
  iconColor?: string | null,
} & React.ComponentProps<typeof IconQuestionMark>) => {
  // アイコンが指定されていない場合、はてなマークを返却する
  if (!iconName || typeof iconName !== "string") return <IconQuestionMark {...props} />

  // プレフィックスの長さ
  const PREFIX_LEN = 2

  // プレフィックスでセットを判断
  const IconComponent = 
    iconName.startsWith("Fa") && iconName in FaIcons ? (FaIcons as any)[iconName] :
    iconName.startsWith("Tb") && iconName in TbIcons ? (TbIcons as any)[iconName] :
    iconName.startsWith("tb") && iconName.slice(PREFIX_LEN) in TablerIcons ? (TablerIcons as any)[iconName.slice(PREFIX_LEN)] :
    IconQuestionMark

  return (
    <IconComponent color={iconColor ?? "#000000"} size={iconSize} {...props} />
  )
}
