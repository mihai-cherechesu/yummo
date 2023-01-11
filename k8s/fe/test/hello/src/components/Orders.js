import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import './Orders.css';
import NavBar from "./NavBar";
import { FooterContainer } from "./FooterContainer";
import { useLocation } from "react-router-dom";

const Orders = () => {
  const proxy = process.env.REACT_APP_REVERSE_PROXY;
	const rolesClaim = process.env.REACT_APP_AUTH0_ROLES_CLAIM;

  const orderStatusMap = {
    'Pending': 0,
    'Preparing': 1,
    'Delivering': 2,
    'Finished': 3
  };

	const { user, isLoading } 	= useAuth0();
  const { state } = useLocation();
  const [ activeStep, setActiveStep ] = React.useState(0);
  const [ artificialLoading, setArtificialLoading ] = React.useState(true);
  const disableArtificial = () => {
    setArtificialLoading(false);
  }
  const timer = setTimeout(disableArtificial, 1500);

  React.useEffect(() => {
    if (state) {
      setActiveStep(orderStatusMap[order.status]);
    }
    }, [] 
  )

  if (!state) {
    return (
      <div className="container">
        <div className="Orders-Contact">
          <FooterContainer />
        </div>
        <div className="Profile-Navbar">
          <NavBar />
        </div>
        <div className="Orders-Info">
          Order not found page!
        </div>
      </div>
    );
  }

  const { order } = state;
  const steps = [
    {
      label: 'Confirm',
      description: user && user[rolesClaim][0] === 'client' ?
        `A courier has to confirm your order.` :
        `Accept this order.`,
    },
    {
      label: 'Get products',
      description: user && user[rolesClaim][0] === 'client' ?
        `The courier is getting the products for you.` :
        `Continue when all products have been gathered from Medissistance's centers.`,
    },
    {
      label: 'Deliver',
      description: user && user[rolesClaim][0] === 'client' ?
        `The courier is delivering the products to you.` :
        `Finish when you reach the client's destination.`,
    },
  ];

  const handleNext = () => {
    const requestHeaders = new Headers();
      requestHeaders.append('Content-Type', 'application/json');
  
      const requestOptions = {
        method: 'PUT',
        headers: requestHeaders,
        body: `${user.email}`
      };
    
      fetch(proxy + `/orders/update/${order.order_number}`, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          },
  
          (error) => {
            console.error(error);
            setActiveStep((prevActiveStep) => prevActiveStep);
          }
        )
  };

  const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');

  if (isLoading || artificialLoading) {
    console.log("Loading from Orders.js!")
    return <Loading />;
  }

  /* Set the starting active step. */

  return (
    <div className="container">
      <div className="Orders-Contact">
        <FooterContainer />
      </div>
      <div className="Profile-Navbar">
        <NavBar />
      </div>
      <div className="Orders-Info">
        <div className="Orders-Info-oid">
          Order #{order.order_number}
        </div>

        <div className="Orders-Info-client">
          <div className="Orders-Info-heading">
            {
              user && user[rolesClaim][0] === 'client' ?
              "Courier name" :
              "Client name"
            }
          </div>
          <div className="Orders-Info-data">
            {order.name}
          </div>
        </div>

        <div className="Orders-Info-address">
          <div className="Orders-Info-heading">
            Delivery address
          </div>
          <div className="Orders-Info-data">
            {order.address}
          </div>
        </div>

        <div className="Orders-Info-products">
          <div className="Orders-Info-heading">
            Products
          </div>
          <div className="Orders-Info-data">
            {order.products}
          </div>
        </div>

      </div>
      <div className="Orders-Steps">
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    activeStep === 3 && index < 3 ? (
                      <Typography variant="caption">Completed</Typography>
                      ) : 
                    activeStep === 3 && index === 3 ? (
                      <Typography variant="caption">In progress</Typography>
                      ) :
                    activeStep === 2 && index < 2 ? (
                      <Typography variant="caption">Completed</Typography>
                      ) : 
                    activeStep === 2 && index === 2 ? (
                      <Typography variant="caption">In progress</Typography>
                      ) :
                    activeStep === 1 && index < 1 ? (
                      <Typography variant="caption">Completed</Typography>
                      ) : 
                    activeStep === 1 && index === 1 ? (
                      <Typography variant="caption">In progress</Typography>
                      ) :
                    activeStep === 0 && index === 0 ? (
                      <Typography variant="caption">In progress</Typography>
                      ) : null
                    }
                  >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      {user && user[rolesClaim][0] === "courier" &&
                        (<Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={user && user[rolesClaim][0] === "client"}
                          >
                          {index === steps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>)
                      }
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - the order has been delivered</Typography>
            </Paper>
          )}
        </Box>
      </div>
    </div>
  );

}

export default Orders;