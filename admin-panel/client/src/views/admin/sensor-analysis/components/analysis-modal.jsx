/* eslint-disable react/prop-types */
import { useState } from 'react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Divider,
  Text,
  HStack,
  useToast,
  Spinner
} from '@chakra-ui/react'
import { GrTest } from 'react-icons/gr'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { Form, Input, Select } from '@components'
import { getCookies } from '@utils/cookies'

const AnalysisModal = ({ onPredictionExecuted }) => {
  const [loading, setLoading] = useState(false)
  const [avgLoading, setAvgLoading] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { zoneId } = useParams()
  const { accessToken } = getCookies()
  const toast = useToast()

  const headers = {
    Authorization: `Bearer ${accessToken}`
  }

  const options = [{ value: '' }, { value: 'asc' }, { value: 'desc' }]

  const initialValues = {
    number: '',
    orderBy: ''
  }

  const validationSchema = Yup.object().shape({
    number: Yup.number('this must be a number')
      .min(0, 'must be a non-negative number').max(20, 'must not be higher than 20')
      .required('Number is required'),
    orderBy: Yup.string().required('this field is required')
  })

  const handleInstantPrediction = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_INSTANT_PREDICTION_API}/${zoneId}`, { headers })
      onPredictionExecuted(response.data.result, response.data.sampleProperties)
      const { prediction } = response.data.result

      const predictionDataToLocalStrg = {
        prediction,
        sampleProperties: response.data.sampleProperties
      }

      localStorage.setItem('predictionData', JSON.stringify(predictionDataToLocalStrg))
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred, please try again later',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleSubmit = async (values) => {
    setAvgLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL_AVERAGE_PREDICTION_API}/${zoneId}`,
        { number: values.number, orderBy: values.orderBy },
        { headers }
      )
      onPredictionExecuted(response.data.result, response.data.averageValues)
      const { prediction } = response.data.result

      const predictionDataToLocalStrg = {
        prediction,
        sampleProperties: response.data.averageValues
      }

      localStorage.setItem('predictionData', JSON.stringify(predictionDataToLocalStrg))
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred, please try again later',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    } finally {
      setAvgLoading(false)
      onClose()
    }
  }
  return (
    <>
      <Button
        leftIcon={<GrTest size={20} />}
        colorScheme='teal'
        fontWeight={400}
        onClick={onOpen}
      >
        Start sample analysis
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight={500}>Soil Properties Analysis</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='center'>
            <Button my={2} colorScheme='teal' fontWeight={500} onClick={handleInstantPrediction}>
            {loading ? <Spinner size='sm' /> : 'Start an instant test'}
            </Button>
            <Divider py={2} />
            <Text py={2}>
              Or start the test on the average of the values chosen
            </Text>
            <Form initialValues={initialValues} validationSchema={validationSchema} handleSubmit={handleSubmit}>
              <Input name={'number'} label={'Number of samples'}/>
              <Select name='orderBy' label='Order by' options={options} />
              <HStack width='100%' paddingY={3} justifyContent='end'>
                <Button
                  fontWeight={400}
                  variant='ghost'
                  mr={3}
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button fontWeight={400} colorScheme='blue' type='submit'>
                {avgLoading ? <Spinner size='sm' /> : 'Confirm'}
                </Button>
              </HStack>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AnalysisModal
