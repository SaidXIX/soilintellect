import { Flex } from '@chakra-ui/react'

import ManualAnalysis from './components/manual-analysis'

const AnalysisSection = () => {
  return (
    <Flex flex={1} justifyContent='center' textAlign='center'>
      <ManualAnalysis />
    </Flex>
  )
}

export default AnalysisSection
