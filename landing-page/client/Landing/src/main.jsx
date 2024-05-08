import React from 'react'
import ReactDOM from 'react-dom/client'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { I18nextProvider } from 'react-i18next'

import App from './App.jsx'
import Theme from '@themes/theme.js'
import i18n from '@i18n/i18n.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
      <ColorModeScript />
    </ChakraProvider>
  </React.StrictMode>
)
