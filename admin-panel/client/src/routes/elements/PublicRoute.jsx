import { Navigate, Outlet } from 'react-router-dom'
import { getCookies } from '@utils/cookies'

function PublicRoute () {
  const { accessToken } = getCookies()
  if (accessToken) {
    return <Navigate to="/"/>
  }
  return <Outlet />
}

export default PublicRoute
