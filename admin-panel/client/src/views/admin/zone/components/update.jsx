/* eslint-disable react/prop-types */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  IconButton
} from '@chakra-ui/react'
import { MdEdit } from 'react-icons/md'
import { useState, useEffect } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import * as Yup from 'yup'
import axios from 'axios'

import { Form, Input } from '@components'
import { getCookies } from '@utils/cookies'

const containerStyle = {
  width: '100%',
  height: '300px'
}

const UpdateZone = ({ zoneId, onZoneUpdated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [userPosition, setUserPosition] = useState(null)
  const [locationInput, setLocationInput] = useState('')
  const { accessToken } = getCookies()

  const headers = {
    Authorization: `Bearer ${accessToken}`
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.GOOGLE_MAP_API_KEY,
    libraries: ['geometry']
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        error => {
          console.error('Error getting user position:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  const initialValues = {
    name: '',
    implant: ''
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required')
  })

  const handleSubmit = async values => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL_UPDATE_ZONE_API}/${zoneId}`, {
        ...values,
        location: locationInput || `${selectedLocation.lat},${selectedLocation.lng}`
      }, { headers })
      if (response.data.success && response.data.zone) {
        onZoneUpdated(response.data.zone)
      } else {
        console.error('Failed to create zone:', response.data.message)
      }
      onClose()
    } catch (error) {
      console.error('Error creating zone:', error)
    }
  }

  const handleMapClick = (e) => {
    const latLng = `${e.latLng.lat()},${e.latLng.lng()}`
    setSelectedLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    })
    setLocationInput(latLng)
  }

  const handleInputChange = (e) => {
    setLocationInput(e.target.value)
  }

  return (
      <>
        <IconButton
          onClick={onOpen}
          icon={<MdEdit size={19} />}
          fontWeight={400}
          fontSize='sm'
          colorScheme='blue'
        />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Zone Infos</ModalHeader>
            <ModalCloseButton />
            <Form
              initialValues={initialValues}
              validationSchema={validationSchema}
              handleSubmit={handleSubmit}
            >
              <ModalBody>
                <Text>Where is the zone&apos;s location?</Text>
                <Input
                  paddingY={1}
                  name='location'
                  value={locationInput}
                  onChange={handleInputChange}
                />
                {isLoaded && userPosition && (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={userPosition}
                    zoom={13}
                    onClick={handleMapClick}
                  >
                    {selectedLocation && (
                      <Marker position={selectedLocation} />
                    )}
                  </GoogleMap>
                )}
                <Input
                  paddingY={2}
                  name='name'
                  label="What is your new zone's name?"
                />
                <Input
                  paddingY={1}
                  name='implant'
                  label='What do you plant in your zone?'
                />
              </ModalBody>
              <ModalFooter>
                <Button variant='ghost' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button colorScheme='blue' type='submit'>
                  Confirm
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      </>
  )
}

export default UpdateZone
