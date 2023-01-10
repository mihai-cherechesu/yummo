// export const SignUp = () => {
//   return (
//     <h1>Hello, it works</h1>
//   );
// }

// export default SignUp;

import './SignUp.css';
import { useAuth0 } from '@auth0/auth0-react';
import { FooterContainer } from '../FooterContainer';
import { Fragment, useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../../utils/notifier';
import 'react-notifications/lib/notifications.css';

import logo from '../../resources/logo.png'
import presentation_1 from '../../resources/pres_1.png'
import presentation_4 from '../../resources/pres_4.png'
import presentation_6 from '../../resources/pres_6.jpg'
import Select from 'react-select';
import Loading from '../Loading';

export const SignUp = () => {

  const countriesApiUrl = "https://countriesnow.space/api/v0.1/countries/cities";

  const proxy = process.env.REACT_APP_REVERSE_PROXY;
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const oAuth0DatabaseConnection = "Username-Password-Authentication";

  const { loginWithRedirect, isLoading }  = useAuth0();
  const [ cities, setCities ]             = useState([]);
  const [ selectedCity, setSelectedCity ] = useState("");
  const [ email, setEmail ]               = useState("");
  const [ firstName, setFirstName ]       = useState("");
  const [ lastName, setLastName ]         = useState("");
  const [ password, setPassword ]         = useState("");
  const [ isCourier, setIsCourier ]       = useState(false);
	// eslint-disable-next-line
  const [ error, setError ]               = useState(null);

  const handleChangeCity      = e => { setSelectedCity(e.value);      }
  const handleChangeEmail     = e => { setEmail(e.target.value);      }
  const handleChangeFirstName = e => { setFirstName(e.target.value);  }
  const handleChangeLastName  = e => { setLastName(e.target.value);   }
  const handleChangePassword  = e => { setPassword(e.target.value);   }
  const handleChangeIsCourier = e => { setIsCourier(e => !e);  }
  const handleChange_         = e => { console.log(""); }
  const handleSubmit_         = e => { e.preventDefault();
    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        client_id: clientId,
        email: email,
        password: password,
        connection: oAuth0DatabaseConnection,
        user_metadata: { 
          is_courier: isCourier.toString()
        }
      })
    };

    fetch("https://" + domain + "/dbconnections/signup", requestOptions)
      .then(res => res.json())
      .then(
        (res) => {
          fetch(proxy + '/users/', {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: email,
              currentCity: selectedCity
            })
          })
          .then(res => res.json())
          .then(
            (res) => {
              createNotification(
                'success',
                'User successfully created',
                'Proceed further with login!');
            },
            (err) => {
              setError(err);
              console.error(err);
            }
          )
        },

        (err) => {
          setError(err);
          console.error(err);
        }
      ) 
  }

  useEffect(() => {
    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({ country: 'ukraine' })
    };

    fetch(countriesApiUrl, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          var parsed = result.data.map(city => ({ label: city, value: city}));
          setCities(parsed);
        },

        (error) => {
          setError(error);
          console.error(error);
        }
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <div className="A1"></div>  

      <div className="A2"></div>

      <div className="Logo">
        <img className="logo-img" src={logo} alt="Logo"></img>
      </div>

      <div className="Login">
        <div className="login-question">Already have an account?</div>
        <button className="login-button" onClick={() => loginWithRedirect()}>Log In</button>
      </div>

      <div className="Pics">
        <img className="presentation-img-1" src={presentation_1} alt="P1"></img>
        <img className="presentation-img-4" src={presentation_4} alt="P4"></img>
        <img className="presentation-img-6" src={presentation_6} alt="P6"></img>
      </div>

      <div className="A3">
        <h3 className="presentation-message-1">Support Ukraine</h3>
      </div>

      <div className="A4">
        <div className="presentation-message-2">We have launched the Ukraine appeal to raise money to support a tetanus vaccination programme and facilitate the supply of medical equipment for Ukraine.</div>
      </div>
      <div className="sign-up-Contact">
        <FooterContainer />
      </div>

      <div className="Sign-up" onSubmit={handleSubmit_}>
        <h1 className="sign-up-heading">Sign up</h1>
        <div className="sign-up-text">Sign up with a valid email and with a preferred password, or choose to login through our secure third party. </div>
        
        <form className = "sign-up-form">
          <div className="input-container">
            <label className="input-label">Email </label>
            <input type="email" className="input-box" onChange={handleChangeEmail} required />
          </div>

          <div className="input-container">
            <label className="input-label">First Name </label>
            <input type="text" className="input-box" onChange={handleChangeFirstName} required />
          </div>

          <div className="input-container">
            <label className="input-label">Last Name </label>
            <input type="text" className="input-box" onChange={handleChangeLastName} required />
          </div>

          <div className="input-container">
            <label className="input-label">City </label>
            <Fragment>
                <Select
                  options={cities}
                  onChange={handleChangeCity}
                />
                  {(
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      style={{ opacity: 0, height: 0 }}
                      value={selectedCity}
                      onChange={handleChange_}
                      required
                    />
                  )}
            </Fragment>
          </div>

          <div className="input-container">
            <label className="input-label">Password </label>
            <input type="password" className="input-box" onChange={handleChangePassword} required />
          </div>

          <div className="checkbox-container">
            <input 
              type="checkbox"
              className="input-checkbox" 
              onChange={handleChangeIsCourier}
              value={isCourier}
              defaultChecked={false}
            />
            <label className="input-label">I'm a courier </label>
          </div>

          <div className="button-container">
            <input type="submit" className="submit-button" value="Create account"/>
          </div>
        </form>
      </div>

      <NotificationContainer/>
    </div>
  );
}

export default SignUp;
