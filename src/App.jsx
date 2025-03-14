import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loader from './common/Loader';
import './App.css'
import routes from './routes/routes'
import BusinessSignUp from './components/authentication/BusinessSignUp'
import BusinessSignIn from './components/authentication/BusinessSignIn'
import { ProtectedRoute } from './components/Layout/ProtectedRoute'

const Layout = lazy(() => import('./components/Layout/Dashboard'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);


  return loading ? (
    <Loader />
  ) : (
    <Router>
      <Routes>
      <Route path="/" element={<BusinessSignIn />} />
      <Route path="/sign-up" element={<BusinessSignUp />} />
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