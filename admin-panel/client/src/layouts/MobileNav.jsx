import {
  IconButton,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList
} from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi'

import { ColorModeSwitcher } from '@components'
import { getCookies, removeCookies } from '@utils/cookies'

const MobileNav = ({ onOpen, ...rest }) => {
  const navigate = useNavigate()
  const { firstName, familyName } = getCookies()

  const handleSignout = () => {
    removeCookies()
    navigate('/login')
  }
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', '#171717')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          fontSize="1.35rem"
          size="md"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <ColorModeSwitcher />
        <Flex alignItems={'center'}>
          <Menu backgroundColor={useColorModeValue('#212121')}>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack alignItems="start">
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{firstName}{' '}{familyName}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', '#212121')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem bgColor={useColorModeValue('white', '#212121')}>Profile</MenuItem>
              <MenuItem bgColor={useColorModeValue('white', '#212121')}>Settings</MenuItem>
              <MenuDivider />
              <MenuItem bgColor={useColorModeValue('white', '#212121')} onClick={handleSignout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

MobileNav.propTypes = {
  onOpen: PropTypes.func.isRequired
}
export default MobileNav
