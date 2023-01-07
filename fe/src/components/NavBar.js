import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import useComponentVisible from "../hooks/useComponentVisible";
import logo from '../resources/logo.png'
import './NavBar.css'

const NavBar = () => {
	const rolesClaimKey = process.env.REACT_APP_AUTH0_ROLES_CLAIM;
  const navigate = useNavigate();
	const { 
    user,
    logout
  } = useAuth0();

  const { 
    ref, 
    isComponentVisible, 
    setIsComponentVisible 
  } = useComponentVisible(false);

  const handleIconClicked = () => {
    setIsComponentVisible(!isComponentVisible);
  }

  const home = (user && user[rolesClaimKey][0] === "client") ?
        (<a 
            onClick={() => 
              navigate("/home")
            }
          >Medical gear
          </a>) :

        (<a 
            onClick={() => 
              navigate("/home")
            }
          >Deliveries
          </a>)

  const orders = (user && user[rolesClaimKey][0] === "client") ?
    <a 
      onClick={() => 
        navigate("/orders")
      }
    >My orders
    </a> : null;

	return (
    <div className="navbar" ref={ref}>
      <div>
        <img className="navbar-logo-img" src={logo} alt="Logo"></img>
      </div>
      <div className="navbar-menu">
        <div className="navbar-links">
          {home}
          { 
            user && user[rolesClaimKey][0] === "client" &&
            <div className="vertical"></div>
          }
          {orders}
        </div>
        <div className="vertical"></div>
        <div className="navbar-menu-img-container">
          <img 
            className="navbar-user-img"
            src={user.picture}
            alt="User profile"
            onClick={handleIconClicked}
            >  
          </img>
          { isComponentVisible && (
            <div className="navbar-drop-down">
              <ul>
                <li 
                  onClick={() => 
                    navigate("/profile")
                  }
                  >Profile
                </li>
                <li 
                  onClick={() => 
                    logout({ returnTo: "http://localhost:3000/sign-up" })
                  }
                  >Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
	)
}

export default NavBar;