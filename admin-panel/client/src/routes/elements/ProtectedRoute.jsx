import { Navigate, Outlet } from 'react-router-dom'
import { getCookies } from '@utils/cookies'

function ProtectedRoute () {
  const { accessToken } = getCookies()
  if (!accessToken) {
    return <Navigate to='/login' />
  }
  return <Outlet/>
}

export default ProtectedRoute
