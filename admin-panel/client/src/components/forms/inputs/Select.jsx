/* eslint-disable react/prop-types */
import { FormControl, FormErrorMessage, FormLabel, Select } from '@chakra-ui/react'
import { useField } from 'formik'
import PropTypes from 'prop-types'

const CustomSelectField = ({ name, label, options }) => {
  const [field, meta] = useField(name)

  return (
    <FormControl isInvalid={!!(meta.error && meta.touched)}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select {...field}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.value}
          </option>
        ))}
      </Select>
      {meta.error && meta.touched && (<FormErrorMessage>{meta.error}</FormErrorMessage>)}
    </FormControl>
  )
}

CustomSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired
    })
  ).isRequired
}

export default CustomSelectField
