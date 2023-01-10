import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTable, usePagination } from 'react-table'
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom'
import { io } from "socket.io-client";

import NavBar from './NavBar'
import './CourierHome.css'
import { FooterContainer } from './FooterContainer'
import Loading from './Loading';

import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../utils/notifier';
import 'react-notifications/lib/notifications.css';

const rolesClaimKey = process.env.REACT_APP_AUTH0_ROLES_CLAIM;
const Styles = styled.div`

  table {
    tr {
      :last-child {
        td {
        }
      }
    }

    th {
      border-bottom: 1px solid #EDEEF2;
      padding-right: 6em;
      font-weight: 150;
      font-size: 1.5rem;
      line-height: 25px;
      color: #000000;
    },
    td {
      :last-child {
        padding-bottom: 1.5em;
        padding-right: 1.5em;
        border-right: 0;
      }
    }
  }

  .table-data {
    color: #000000;
    font-weight: 150;
  }

  .table-header {
    font-weight: bold;
  }

  .pagination {
    border-top: 1px solid #EDEEF2;
    padding: 0.5rem;
    margin-top: 3rem;
  }

  .pagination button {
    background: #37ABC8;
    border-radius: 15px;
    border-style: none;
    color: #FFFFFF;

    width: 35px;
    height: 25px;
    align-items: center;
    margin-right: 0.3rem;
  }

  .pagination button:hover {
    color: #2B2B43;
    border: 1px solid #37ABC8;
    transition: 200ms ease-in;
  }

  .accept-button {
    width: 160px;
    height: 28px;
    font-weight: bold;
    font-size: 16px;

    background: #37ABC8;
    border-radius: 10px;
    border-style: none;
    color: #FFFFFF;
  }

  .accept-button:hover {
    color: #2B2B43;
    border: 1.8px solid #37ABC8;
    transition: 200ms ease-in;
  }

  .table-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 4rem;
  }

  .page-out-of {
    font-weight: 150;
    margin-right: 1.5rem;
    margin-left: 1.5rem;
  }

  .go-to-page {
    border-radius: 10px;
    font-weight: 150;
    margin-right: 1.5rem;
  }

  .pagination-show {
    font-weight: 150;
    border-radius: 10px;
  }

  .pagination-button {
    font-weight: bold;
  }

  .state-button {
    width: 160px;
    height: 28px;
    font-weight: bold;
    font-size: 16px;

    border-radius: 10px;
    border-style: none;
    color: #FFFFFF;
  }

  .state-button:hover {
    color: #2B2B43;
    border: 1.8px solid #37ABC8;
    transition: 200ms ease-in;
  }
`

function Table({ columns, data, dataSetter, user }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );
  const proxy = process.env.REACT_APP_REVERSE_PROXY;
  const rolesClaimKey = process.env.REACT_APP_AUTH0_ROLES_CLAIM;
  const navigate = useNavigate();
  const [ socket, setSocket ] = useState(null);

  useEffect(() => {
    setSocket(io("http://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com/socket/"));
  }, [user]);

  useEffect(() => {
    socket?.emit("newUser", {
      email: `${user.email}`,
      role: user && user[rolesClaimKey][0]
    })

    if (user && user[rolesClaimKey][0] === "client") {
      console.log("Listening on getOrder!");
      socket?.on("getOrder", data => {
        createNotification(
          'success',
          'Order accepted',
          `Order ${data.orderId} successfully accepted by ${data.email}.`);

        const requestHeaders = new Headers();
        requestHeaders.append('Content-Type', 'application/json');
    
        const requestOptions = {
          method: 'GET',
          headers: requestHeaders
        };
        
        fetch(proxy + `/orders/${user[rolesClaimKey][0]}/${user.email}`, requestOptions)
          .then(res => res.json())
          .then(
            (result) => {
              console.log(result);
              dataSetter(result);
            },
    
            (error) => {
              console.error(error);
            }
          )
        
      })
    }
  }, [socket, user]);

  const handleViewDetails = (order) => {
    navigate(`/order/${order.order_number}`, {
      state: {
        order: order
      }
    });
  };

  const handleAcceptOrder = (order) => {
    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'PUT',
      headers: requestHeaders,
      body: `${user.email}`
    };

    fetch(proxy + `/orders/accept/${order.order_number}`, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          createNotification(
            'success',
            'Update successfully',
            'Order accepted successfully. Yummo food delivery center informed to start preparing.');

          socket?.emit("sendOrder", {
            email: `${user.email}`,
            orderId: `${order.order_number}`
          })

          var newData = data.map((o) => {
            if (o.order_number === order.order_number) {
              let newOrder = {...o};
              newOrder.status = result.status;
              return newOrder;
            }
            return o;
          })

          dataSetter(newData);
        },

        (error) => {
          console.error(error);
        }
      )
  };

  return (
    <div className='table-container'>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className='table-header' {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  return (
                    <td className='table-data' {...cell.getCellProps()}>
                      {
                        cell.value === 'Pending' && i === row.cells.length - 1 ?
                          (user && user[rolesClaimKey][0] === 'client' ?
                            <button className="state-button"  onClick={() => handleViewDetails(row.values)} style={{ background: '#D18006' }}>Pending</button> :
                            <button className="accept-button" onClick={() => handleAcceptOrder(row.values)}>Accept</button>
                          ) :
                        cell.value === 'Preparing' && i === row.cells.length - 1 ?
                          <button className="state-button" onClick={() => handleViewDetails(row.values)} style={{ background: '#37ABC8' }}>Preparing</button> :

                        cell.value === 'Delivering' && i === row.cells.length - 1 ?
                          <button className="state-button" onClick={() => handleViewDetails(row.values)} style={{ background: '#3EA100' }}>Delivering</button> :

                        cell.value === 'Finished' && i === row.cells.length - 1 ?
                          <button className="state-button" onClick={() => handleViewDetails(row.values)} style={{ background: '#3EA100' }}>Finished</button> :
                          
                        cell.render('Cell')
                      }
                    </td>
                  );
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button className='pagination-button' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button className='pagination-button' onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button className='pagination-button' onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button className='pagination-button' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span className='page-out-of'>
          Page{' '}
          {pageIndex + 1} of {pageOptions.length}{' '}
        </span>
        {/* <span>
          Go to page:{' '}
          <input
            className='go-to-page'
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          className='pagination-show'
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </div>

      <NotificationContainer/>
    </div>
  )
}

function CourierHome() {
  const proxy = process.env.REACT_APP_REVERSE_PROXY;
  const rolesClaimKey = process.env.REACT_APP_AUTH0_ROLES_CLAIM;
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [ tableData, setTableData ] = useState([]);

  useEffect(() => {
    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'GET',
      headers: requestHeaders
    };
    
    fetch(proxy + `/orders/${user[rolesClaimKey][0]}/${user.email}`, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          setTableData(result);
        },

        (error) => {
          console.error(error);
        }
      )
  }, []);

  const tableColumns = React.useMemo(
    () => [
      {
        Header: 'Order Number',
        accessor: 'order_number'
      },
      ...(user && user[rolesClaimKey][0] === 'courier' ?
        [{
          Header: 'Client name',
          accessor: 'name'
        }] :
        [{
          Header: 'Courier name',
          accessor: 'name'
        }]
      ),
      {
        Header: 'Phone number',
        accessor: 'phone_number'
      },
      {
        Header: 'Address',
        accessor: 'address'
      },
      {
        Header: 'Products',
        accessor: 'products'
      },
      {
        Header: '',
        accessor: 'status'
      }
    ],
    []
  )

  const [ artificialLoading, setArtificialLoading ] = React.useState(true);
  const disableArtificial = () => {
    setArtificialLoading(false);
  }

  const timer = setTimeout(disableArtificial, 1500);

  if (isLoading || artificialLoading) {
    console.log("Loading from CourierHome.js!")
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="Courier-Contact">
        <FooterContainer />
      </div>
      <div className="Courier-NavBar">
        <NavBar />
      </div>
      <div className="Courier-Table">
        <Styles>
          <Table columns={tableColumns} data={tableData} dataSetter={setTableData} user={user} />
        </Styles>
      </div>
    </div>
  )
}

export default CourierHome;
