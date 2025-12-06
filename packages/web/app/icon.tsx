import { IconClipboard, IconHome2, IconUsers, IconWorld } from '@tabler/icons-react';
import type { ComponentProps } from 'react';

type IconProps = ComponentProps<typeof IconHome2>;

export const HomeIcon = (props: IconProps) => {
  return <IconHome2 className='home-color' {...props} />
};
export const ClipboardIcon = (props: IconProps) => {
  return <IconClipboard className='clipboard-color' {...props} />
};
export const WorldIcon = (props: IconProps) => {
  return <IconWorld className='world-color' {...props} />
};
export const UsersIcon = (props: IconProps) => {
  return <IconUsers className='users-color' {...props} />
};
