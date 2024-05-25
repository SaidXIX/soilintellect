import { extendTheme } from '@chakra-ui/react'

// Supports weights 200-800
import '@fontsource/poppins'
import '@fontsource-variable/changa'

import i18n from '@i18n/i18n'

const Theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true
  },
  direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
  colors: {
    lightMode: {
        primary: '#00684A',
    },
    darkMode: {
        primary: '#00ED64'
    }
  },
  fonts: {
    heading: ' Poppins, Changa Variable',
    body: 'Poppins, Changa Variable'
  },
  fontDisplay: 'swap'
})

export default Theme