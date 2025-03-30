import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import { ToastContainer } from 'react-toastify';

import Loader from './common/Loader';
import './App.css'
import routes from './routes/routes'
import BusinessSignUp from './components/authentication/BusinessSignUp'
import BusinessSignIn from './components/authentication/BusinessSignIn'
import { ProtectedRoute } from './components/Layout/ProtectedRoute'
import VerifyEmailAddress from './components/authentication/VerifyEmailAddress';

const Layout = lazy(() => import('./components/Layout/Dashboard'));

function App() {
  
  return (
    <Router>
     <ToastContainer/>
      <Routes>
      <Route path="/" element={<BusinessSignIn />} />
      <Route path="/sign-up" element={<BusinessSignUp />} />
      <Route path="/verify" element={<VerifyEmailAddress />} />
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
      </Routes>
    </Router>
  )
}

export default App