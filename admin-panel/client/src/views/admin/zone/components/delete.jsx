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
  Alert,
  AlertIcon,
  IconButton
} from '@chakra-ui/react'
import { MdDelete } from 'react-icons/md'
import axios from 'axios'

import { getCookies } from '@utils/cookies'

const DeleteZone = ({ zoneId, zoneName, onDeleteZone }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { accessToken } = getCookies()

  const headers = {
    Authorization: `Bearer ${accessToken}`
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL_DELETE_ZONE_API}/${zoneId}`, { headers })
      onDeleteZone(zoneId)
      onClose()
    } catch (error) {
      console.error('Error deleting zone:', error)
    }
  }
  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={<MdDelete size={24}/>}
        colorScheme='red'
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Zone</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete the zone <Text fontWeight='bold'> {zoneName}</Text></Text>
            <Alert status='warning'>
              <AlertIcon />
              This operation is irreversible
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='red' onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteZone
