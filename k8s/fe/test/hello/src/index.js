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
    navigate(window.location.hash ? window.location.hash : window.location.pathname, {replace: true})
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
      redirectUri="https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com/nginx-fe/#/home"
    >
      <App />
    </Auth0ProviderWithRedirectCallback>
  </HashRouter>
);