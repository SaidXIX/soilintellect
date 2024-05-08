import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

import ManualAnalysis from './components/manual/manual-analysis'

const AnalysisSection = () => {
  return (
    <Flex flex={1} justifyContent='center'>
      <Tabs variant='soft-rounded' colorScheme='green' width={{ base: '100%', md: '40%' }}>
        <TabList alignItems='center' justifyContent='center'>
          <Tab>Manual Analysis</Tab>
          <Tab>Sensor Analysis</Tab>
        </TabList>
        <TabPanels>
          <TabPanel textAlign='center' justifyItems='center' alignItems='center'>
            <ManualAnalysis />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default AnalysisSection
