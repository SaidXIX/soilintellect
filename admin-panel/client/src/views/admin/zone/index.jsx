import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  HStack,
  Link,
  Button
} from '@chakra-ui/react'
import { FaChartLine } from 'react-icons/fa6'
import { FaMapMarkerAlt } from 'react-icons/fa'

import { getCookies } from '@utils/cookies'
import CreateZone from './components/create'
import DeleteZone from './components/delete'

const ZoneSection = () => {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [zoneCreated, setZoneCreated] = useState(false)

  const { accessToken } = getCookies()

  const headers = {
    Authorization: `Bearer ${accessToken}`
  }

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_URL_GET_ZONES_API,
          { headers }
        )
        if (response.data.success) {
          setZones(response.data.zones)
        } else {
          setError('Failed to fetch zones')
        }
      } catch (err) {
        setError('An error occurred while fetching the data')
      } finally {
        setLoading(false)
      }
    }

    fetchZones()
  }, [zoneCreated])

  const handleZoneCreated = (newZone) => {
    if (newZone && newZone.name && newZone.location && newZone.implant) {
      setZoneCreated(true)
      setZones(prevZones => [...prevZones, newZone])
    } else {
      console.error('New zone is missing required properties:', newZone)
    }
  }

  const handleDeleteZone = (deletedZoneId) => {
    setZones((prevZones) => prevZones.filter((zone) => zone.id !== deletedZoneId))
  }

  const renderLocationLink = (location) => {
    const [lat, lng] = location.split(',')
    return (
      <Button
        as={Link}
        leftIcon={<FaMapMarkerAlt/>}
        fontWeight={400}
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        isExternal
        colorScheme='orange'
      >
        View on Google Maps
      </Button>
    )
  }
  return (
    <Flex flex={1} p={5} direction='column'>
      <HStack width='100%' my={2} justifyContent='end'>
        <CreateZone onZoneCreated={handleZoneCreated}/>
      </HStack>
      <TableContainer
        bgColor={useColorModeValue('white', 'black')}
        boxShadow='lg'
        borderRadius='0.3em'
        width='100%'
      >
        {loading
          ? (
          <Flex justify='center' align='center' height='100%'>
            <Spinner />
          </Flex>
            )
          : error && !zoneCreated
            ? (
          <Alert status='error'>
            <AlertIcon />
            {error}
          </Alert>
              )
            : (
          <Table variant='striped' colorScheme='gray'>
            <TableCaption>Zones Information</TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Location</Th>
                <Th>Implant</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {zones.map(zone => (
                <Tr key={zone.id}>
                  <Td>{zone.name}</Td>
                  <Td>{renderLocationLink(zone.location)}</Td>
                  <Td>{zone.implant}</Td>
                  <Td>
                    <HStack>
                      <IconButton
                        padding={0.5}
                        fontSize='md'
                        fontWeight='bold'
                        colorScheme='teal'
                        icon={<FaChartLine />}
                      />
                      <DeleteZone zoneId={zone.id} zoneName={zone.name} onDeleteZone={handleDeleteZone}/>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
              )}
      </TableContainer>
    </Flex>
  )
}

export default ZoneSection
