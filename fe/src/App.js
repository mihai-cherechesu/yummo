import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import SignUp from './components/auth/SignUp';
import ClientHome from './components/ClientHome';
import CourierHome from './components/CourierHome';
import Orders from './components/Orders';

export const App = () => {

  const { isAuthenticated, user } = useAuth0();
  const rolesClaimKey = process.env.REACT_APP_AUTH0_ROLES_CLAIM;

  return (
    <Routes>
      <Route 
        exact
        path="/"
        element={
          isAuthenticated ?
          <Navigate to="/home" replace /> :
          <Navigate to="/sign-up" replace />
        }
      />
      <Route 
        path="/sign-up"
        element={<SignUp />}
      />
      <Route 
        path="/home"
        element={
          (user && user[rolesClaimKey][0] === "client") ?
          <ProtectedRoute component={ClientHome} /> :
          <ProtectedRoute component={CourierHome} />
        }
      />
      <Route 
        path="/profile"
        element={<ProtectedRoute component={Profile} />}
      />

      <Route 
        path="/orders"
        element={<ProtectedRoute component={CourierHome} />}
      />

      <Route
        path="/order/*"
        element={<ProtectedRoute component={Orders}/>}
      />
    </Routes>
  );
}

export default App;
