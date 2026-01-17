import { IconClipboard, IconHome2, IconUsers, IconWorld, IconClipboardOff } from '@tabler/icons-react'
import type { ComponentProps } from 'react'
import { menuColors, commonColors } from '@/app/(core)/_theme/colors'

type IconProps = ComponentProps<typeof IconHome2>

export const HomeIcon = (props: IconProps) => {
  return <IconHome2 color={menuColors.home} {...props} />
}
export const ClipboardIcon = (props: IconProps) => {
  return <IconClipboard color={menuColors.quest} {...props} />
}
export const PenaltyIcon = (props: IconProps) => {
  return <IconClipboardOff color={commonColors.penalty} {...props} />
}
export const WorldIcon = (props: IconProps) => {
  return <IconWorld color={commonColors.world} {...props} />
}
export const UsersIcon = (props: IconProps) => {
  return <IconUsers color={menuColors.members} {...props} />
}
