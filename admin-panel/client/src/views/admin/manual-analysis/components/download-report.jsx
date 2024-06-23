import { Button } from '@chakra-ui/react'
import { FaDownload } from 'react-icons/fa6'
import axios from 'axios'

import { getCookies } from '@utils/cookies'

const DownloadReportButton = () => {
  const { accessToken } = getCookies()

  const handleDownload = async () => {
    const storedPredictionData = localStorage.getItem('predictionData')
    const storedDiagnostics = localStorage.getItem('plantInfo')

    if (!storedPredictionData || !storedDiagnostics) {
      console.error('Required data not found in local storage')
      return
    }

    const parsedPredictionData = JSON.parse(storedPredictionData)
    const parsedDiagnostics = JSON.parse(storedDiagnostics)

    const dataToSend = {
      ...parsedPredictionData,
      diagnostics: parsedDiagnostics
    }

    try {
      const response = await axios.post(import.meta.env.VITE_URL_GENERATE_PDF_API, dataToSend, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
      const pdfUrl = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = 'prediction_data.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error sending data to API:', error)
    }
  }

  return (
    <Button
      marginY={2}
      variant='outline'
      colorScheme='teal'
      size='sm'
      leftIcon={<FaDownload size={17} />}
      onClick={handleDownload}
    >
      Download Report
    </Button>
  )
}

export default DownloadReportButton
