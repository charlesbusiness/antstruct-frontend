import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Loader from './common/Loader';
import './App.css'
import routes from './routes/routes'
import BusinessSignUp from './Pages/Authentication/BusinessSignUp'
import BusinessSignIn from './Pages/Authentication/BusinessSignIn'
import Home from './Pages/LandingPage/index';
import { ProtectedRoute } from './components/Layout/ProtectedRoute'
import PageNotFound from './Pages/NotFound';
import VerifyEmailAddress from './Pages/Authentication/VerifyEmailAddress';
import { TitleProvider } from './hooks/TitleContext';
import ResetPassword from './Pages/Authentication/ResetPassword';
import VerifyPasswordOtpForm from './Pages/Authentication/VerifyPasswordOtpForm';
const Layout = lazy(() => import('./components/Layout/Dashboard'));

function App() {

  return (
    <TitleProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<BusinessSignIn />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<BusinessSignUp />} />
          <Route path="/verify" element={<VerifyEmailAddress />} />
          <Route path="/password/reset/:otp" element={<ResetPassword />} />
          <Route path='/verify-password/otp/:id' element={<VerifyPasswordOtpForm />} />
          <Route element={<Layout />} >
            <Route path='/' element={<ProtectedRoute />}>
              {routes.map((route, index) => {
                const { path, component: Component } = route;
                return (
                  <Route
                    key={index}
                    path={path}
                    element={
                      <Suspense fallback={<Loader />}>
                        <Component />
                      </Suspense>
                    }
                  />
                );
              })}
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </TitleProvider>
  )
}

export default App