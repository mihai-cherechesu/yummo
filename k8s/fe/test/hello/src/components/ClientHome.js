import { FooterContainer } from "./FooterContainer";
import NavBar from "./NavBar";
import './ClientHome.css'
import { useEffect, useState } from "react";
import CartIcon from "./CartIcon";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import { io } from "socket.io-client";

import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../utils/notifier';
import 'react-notifications/lib/notifications.css';


let lastFilterUpdate;

const ClientHome = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const proxy = process.env.REACT_APP_REVERSE_PROXY;
  const rolesClaimKey = process.env.REACT_APP_AUTH0_ROLES_CLAIM;
  const cardsNumber = 6;

  const filterIndexArray = [
    'Pizza',
    'Chinese', 
    'Burgers', 
    'Healthy',
    'Fast food', 
    'Mexican'
  ];

  const [ basket, setBasket ]                         = useState([]);
  const [ productsArray, setProductsArray ]           = useState([]);
  const [ artificialLoading, setArtificialLoading ]   = useState(true);
  const [ socket, setSocket ]                         = useState(null);
  const [ filterClassArray, setFilterClassArray ]     = useState([
    "filter", "filter-pressed", "filter", "filter", "filter", "filter"
  ]);
  const disableArtificial = () => {
    setArtificialLoading(false);
  }

  useEffect(() => {
    setSocket(io("https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com/socket/", { 
        secure: false, 
        // transports: ['websocket'],
        reconnection: true,
      }
    ));
  }, [user]);

  useEffect(() => {
    socket?.emit("newUser", {
      email: `${user.email}`,
      role: user ? user[rolesClaimKey][0] : 'client'
    })
  }, [socket, user]);

  useEffect(() => {
    const activeFilters = [];

    for (let i = 0; i < filterIndexArray.length; i++) {
      if (filterClassArray[i] === "filter-pressed") {
        activeFilters.push(filterIndexArray[i]);
      }
    }

    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(activeFilters)
    };

    fetch(proxy + '/products/search', requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          setProductsArray(result.slice(0, cardsNumber));
        },

        (error) => {
          console.error(error);
        }
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const timer = setTimeout(disableArtificial, 1500);
  if (isLoading || artificialLoading) {
    return <Loading />;
  }

  const changeFilterStyle = (i) => {
    let newfilterClassArray = [...filterClassArray];

    newfilterClassArray[i] = filterClassArray[i] === "filter" ? 
      "filter-pressed" :
      "filter";
    
    setFilterClassArray(newfilterClassArray);

    const activeFilters = [];

    for (let i = 0; i < filterIndexArray.length; i++) {
      if (newfilterClassArray[i] === "filter-pressed") {
        activeFilters.push(filterIndexArray[i]);
      }
    }
    
    lastFilterUpdate = Date.now();
    setTimeout(() => {
      const delta = Date.now() - lastFilterUpdate;

      if (delta >= 2000) {
        const requestHeaders = new Headers();
        requestHeaders.append('Content-Type', 'application/json');
    
        const requestOptions = {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(activeFilters)
        };
    
        fetch(proxy + '/products/search', requestOptions)
          .then(res => res.json())
          .then(
            (result) => {
              setProductsArray(result.slice(0, cardsNumber));
            },
    
            (error) => {
              console.error(error);
            }
          )
      }
    }, 2000)
  }
  
  const getProductCount = (id) => {
    let product = basket.find(item => item.id === id);
    return product === undefined ? 0 : product.count;
  }

  const changeBasket = (i, sign, id) => {
    let left = productsArray[i].leftStock;
    let product = basket.find(item => item.id === id);

    if (product === undefined) {
      setBasket([
        ...basket,
        { id: id, count: sign === "+" ? 1 : 0 }
      ]);

    } else {
      let count = product.count;

      let updated = sign === "+" ? 
        count + 1 > left ? left : count + 1 :
        count - 1 < 0 ? 0 : count - 1;

      if (count === updated) {
        return;
      }

      setBasket(
        basket.map((item) => {
          return item.id === id ? { id: id, count: updated } : item;
        })
      )
    }
  }

  const placeOrder = () => {
    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        clientEmail: user.email,
        products: basket
      })
    };

    fetch(proxy + '/orders/', requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          createNotification(
            'success',
            'Order placed',
            'Order successfully placed. Medissistance is finding a courier for you.');
          console.log(result);
        },

        (error) => {
          console.error(error);
        }
      )
  }
  
	return (
    <div className="home-container">
      <link href="https://use.fontawesome.com/releases/v5.0.1/css/all.css" rel="stylesheet"></link>
      <div className="home-NavBar">
        <NavBar />
      </div>

      <div className={`F1 ${filterClassArray[0]}`} onClick={() => changeFilterStyle(0)}><small>Pizza</small></div>
      <div className={`F2 ${filterClassArray[1]}`} onClick={() => changeFilterStyle(1)}><small>Chinese</small></div>
      <div className={`F3 ${filterClassArray[2]}`} onClick={() => changeFilterStyle(2)}><small>Burgers</small></div>
      <div className={`F4 ${filterClassArray[3]}`} onClick={() => changeFilterStyle(3)}><small>Healthy</small></div>
      <div className={`F5 ${filterClassArray[4]}`} onClick={() => changeFilterStyle(4)}><small>Fast food</small></div>
      <div className={`F6 ${filterClassArray[5]}`} onClick={() => changeFilterStyle(5)}><small>Mexican</small></div>
      
      <div className="home-Contact">
        <FooterContainer />
      </div>
      
      <div className="home-Order">
        <button className="order-button" onClick={placeOrder}>
          Place Order
        </button>
      </div>

      {
        productsArray.map((p, i) => {
          return (
            <div className={`C${i + 1} card`} key={p.id}>
              <div className="card-content">
                <img className="card-photo" src={p.photoURL} alt="Product"></img>
                <div className="card-meta">
                  <div className="L1">
                    <h6>{p.name}</h6>
                    <CartIcon count={getProductCount(p.id)} />
                  </div>
      
                  <p className="L2">
                    {p.leftStock} left in stock
                  </p>
      
                  <div className="L3">
                    <button className="card-tag">{p.categoryNames[0]}</button>
                    <div className="plus-minus">
                      <button onClick={() => changeBasket(i, "-", p.id)}>-</button>
                      <button onClick={() => changeBasket(i, "+", p.id)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      }
      <NotificationContainer/>
    </div>
	) 
}

export default ClientHome;