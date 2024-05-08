import { extendTheme } from '@chakra-ui/react'

// Supports weights 200-800
import '@fontsource/poppins'
import '@fontsource-variable/changa'

// import i18n from '@i18n/i18n'

const Theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true
  },
  // direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
  colors: {
    lightMode: {
      primary: '#00684A',
      secondary: '#F2A50A',
      background: '#FFFFFF',
      inputBackground: '#FFFFFF',
      text: '#1A2E4A',
      borderColor: '#E3E3E9'
    },
    darkMode: {
      primary: '#00ED64',
      secondary: '#1D2B83',
      background: '#1C1C1E',
      inputBackground: '#111111',
      text: '#F1F1F1',
      borderColor: '#373737'
    }
  },
  fonts: {
    heading: 'Poppins, Changa',
    body: 'Poppins, Changa'
  },
  fontDisplay: 'swap'
})

export default Theme
