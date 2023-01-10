// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
// import Profile from './components/Profile';
import SignUp from './components/auth/SignUp';
import ClientHome from './components/ClientHome';
import CourierHome from './components/CourierHome';
// import Orders from './components/Orders';

export const App = () => {

  const { isAuthenticated, user } = useAuth0();
  const rolesClaimKey = process.env.REACT_APP_AUTH0_ROLES_CLAIM;

  console.log("I'm authenticated " + isAuthenticated);

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
    </Routes>
  );
}

export default App;

