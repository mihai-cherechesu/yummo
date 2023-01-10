// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import './index.css';
import App from './App';
import * as ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { HashRouter, useNavigate } from 'react-router-dom';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {

  const navigate = useNavigate();
  const onRedirectCallback = (appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <HashRouter>
    <Auth0ProviderWithRedirectCallback
      domain={domain}
      clientId={clientId}
      redirectUri="https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com/nginx-fe/home"
    >
      <App />
    </Auth0ProviderWithRedirectCallback>
  </HashRouter>
);