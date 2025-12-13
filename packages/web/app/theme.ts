import { Button, createTheme, type MantineTheme } from '@mantine/core'

export const theme = createTheme({
  // primaryColor: '',

  // colors: {
  //   appColor: [
  //     '#40c2ff',
  //     '#0cadff',
  //     '#0096e6',
  //     '#0078bb',
  //     '#005c90',
  //     '#004066',
  //     '#00263d',
  //     '#001625',
  //     '#000a12',
  //     '#000000',
  //   ] as const,
  // },

  fontSizes: {
    xs: "14px",
    sm: "15px",
    md: "16px",
    lg: "18px",
    xl: "20px",
  },
  // defaultGradient: {
  //   from: '#fff5ff',
  //   to: 'hsl(199, 100%, 75%)',
  //   deg: 120,
  // } as const,

  defaultRadius: 'sm',

})
