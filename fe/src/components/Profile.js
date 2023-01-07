import { useAuth0 } from "@auth0/auth0-react";
import { Fragment, useEffect, useState } from 'react';

import PhoneInputWithCountrySelect from "react-phone-number-input";
import { FooterContainer } from "./FooterContainer";
import Loading from "./Loading";
import NavBar from "./NavBar";
import Select from 'react-select';
import "./Profile.css"
import 'react-phone-number-input/style.css'

import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../utils/notifier';
import 'react-notifications/lib/notifications.css';

const Profile = () => {
  const proxy = process.env.REACT_APP_REVERSE_PROXY;
	const rolesClaim = process.env.REACT_APP_AUTH0_ROLES_CLAIM;
	const { user, isAuthenticated, isLoading } 	= useAuth0();

	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');

	const [ firstName, setFirstName ]       		= useState("");
  const [ lastName, setLastName ]        			= useState("");
  const [ phoneNumber, setPhoneNumber ]				= useState("");
  const [ selectedCity, setSelectedCity ] 		= useState("");
  const [ address, setAddress ]						 		= useState("");
  const [ cities, setCities ]			            = useState([]);
  const [ error, setError ]               		= useState(null);

  const handleChangeCity      		= e => { setSelectedCity(e.value); }
  const handleChangeAddress      	= e => { setAddress(e.target.value); }
	const handleChangeFirstName 		= e => { setFirstName(e.target.value); }
  const handleChangeLastName  		= e => { setLastName(e.target.value); }
  const handleChangePhoneNumber  	= e => { setPhoneNumber(e); }
  const handleChange_         		= e => { console.log(""); }
	const handleSubmit_         		= e => { e.preventDefault();
		fetch(proxy + `/users/${user.email}`, {
			method: 'PUT',
			headers: requestHeaders,
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				phoneNumber: phoneNumber,
				currentCity: selectedCity,
				address: address
			})
		})
		.then(
			() => {
			console.log(address);
			createNotification(
				'success',
				'Update successfully',
				'Profile Information updated');
			},

			(error) => {
				setError(error);
				console.error(error);
			}
		)
	};
	
	useEffect(() => {
		const countriesApiUrl = "https://countriesnow.space/api/v0.1/countries/cities";

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

			fetch(proxy + `/users/search?email=${user.email}`, {
				method: 'GET',
				headers: requestHeaders
			})
			.then((res) => res.json())
			.then(
				(result) => {
					console.log(result);
					setSelectedCity(result.currentCity);
					setFirstName(result.firstName);
					setLastName(result.lastName);
					setPhoneNumber(result.phoneNumber);
					setAddress(result.address);
				}
			)
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

	const [ artificialLoading, setArtificialLoading ] = useState(true);
  const disableArtificial = () => {
    setArtificialLoading(false);
  }

  const timer = setTimeout(disableArtificial, 1500);

	if (isLoading || artificialLoading) {
    console.log("Loading from Profile.js!")
    return <Loading />;
  }

	return (
		isAuthenticated && (
		<div className="container">
  		<div className="Profile-Contact">
				<FooterContainer />
			</div>
			<div className="Profile-Navbar">
				<NavBar />
			</div>

			<div className="Profile-Info" onSubmit={handleSubmit_}>
				<h1 className="profile-heading">Personal Information</h1>
				<form id="profile-form" className="profile-form">
					<div className="profile-container">
						<div className="item">
							<label className="input-label">First name </label>
							<input 
								type="text" 
								defaultValue={firstName} 
								onChange={handleChangeFirstName} 
								className="input-box"
							/>
						</div>
						<div className="item">
							<label className="input-label">Last name</label>
							<input 
								type="text" 
								defaultValue={lastName} 
								onChange={handleChangeLastName} 
								className="input-box" 
							/>
						</div>

						<div className="item">
							<label className="input-label">Address</label>
							<input 
								type="text" 
								defaultValue={address} 
								onChange={handleChangeAddress} 
								className="input-box" 
							/>
						</div>

						<div className="item">
							<label className="input-label">Email </label>
							<input type="text" placeholder={user.email} className="input-box ro-input" readOnly/>
						</div>

						<div className="item">
							<label className="input-label">Phone number </label>							
							<PhoneInputWithCountrySelect
								style={{}}
								placeholder="Enter phone number"
								country="UA"
								international={true}
								withCountryCallingCode={true}
								defaultCountry="UA"
								value={phoneNumber}
								onChange={handleChangePhoneNumber}
							/>
						</div>
						<div className="item">
							<label className="input-label">City </label>
							<Fragment>
									<Select
										options={cities}
										onChange={handleChangeCity}
										value={{label: selectedCity, value: selectedCity}}
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
					</div>

				</form>
			</div>

			<div className="Profile-Info-Buttons">
				<input type="submit" form="profile-form" className="profile-submit-button" value="Save changes"/>
			</div>

			<NotificationContainer/>
		</div>
		)
	)
}

export default Profile;