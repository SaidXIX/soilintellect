/* eslint-disable react/prop-types */
import { Text, Box } from '@chakra-ui/react'
import { useEffect } from 'react'

import { requirements, recommendations } from './plantData'

const SoilWaterRequirements = ({ type }) => {
  return (
    <>
      <Text fontSize='lg' fontWeight='bold' mb={2}>
        Soil and Water Requirements
      </Text>
      <Text mb={4}>
        {requirements[type].description}
      </Text>
    </>
  )
}

const PlantingMaintenance = ({ type }) => {
  return (
    <>
      <Text fontSize='lg' fontWeight='bold' mb={2}>
        Planting & Maintenance
      </Text>
      <Text>
        {recommendations[type].description}
      </Text>
    </>
  )
}

const Diagnostic = ({ implantType }) => {
  useEffect(() => {
    if (implantType) {
      const diagnostics = {
        soilWater: requirements[implantType]?.description,
        plantingMaintenance: recommendations[implantType]?.description
      }
      localStorage.setItem('plantInfo', JSON.stringify(diagnostics))
    }
  }, [implantType])
  return (
    <>
      {implantType && (
        <Box p={4} borderWidth={1} borderRadius='md'>
          <SoilWaterRequirements type={implantType} />
          <PlantingMaintenance type={implantType} />
        </Box>
      )}
    </>
  )
}

export default Diagnostic
