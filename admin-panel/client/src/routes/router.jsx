import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from '@layouts/Layout'
import { Home, Weather, Analysis, Help, Login, Signup, VerifyEmailRedirect, RequestPasswordReset, PasswordReset } from '@views'
import PublicRoute from './elements/PublicRoute'
import ProtectedRoute from './elements/ProtectedRoute'

const Router = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route element={<PublicRoute/>}>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/request-password-reset" element={<RequestPasswordReset/>}/>
          <Route path='/password-reset/:email/:token' element={<PasswordReset />} />
          <Route path='/signup/verification/:email/:token' element={<VerifyEmailRedirect />}
          />
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="/weather" element={<Weather/>}/>
            <Route path="/analysis" element={<Analysis/>}/>
            <Route path="/help" element={<Help/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
