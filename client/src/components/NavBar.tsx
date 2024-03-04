import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useCart } from './ContextReducer';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        //delete local storage
        localStorage.removeItem("authToken");
        navigate("/login");
    }


    const [cartView, setCartView] = useState(false);

    let data = useCart();



    return (
        <div>
            <header className="p-3 bg-dark text-white">
                <div>
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start ">
                        <span className="fs-4 mx-3 fst-italic ">Foodd</span>


                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li className='nav-item'>
                                <Link to="/" className="nav-link active text-white">Home</Link>
                            </li>

                            {(localStorage.getItem("authToken")) ?
                                <li className='nav-item'>
                                    <Link to="/myOrder" className="nav-link text-white ">My Orders</Link>

                                </li>
                                : ""}

                        </ul>

                        <div className="text-end">
                            {!(localStorage.getItem("authToken")) ?
                                <div>
                                    <Link to="/login" className="btn btn-warning me-2">Login</Link>
                                    <Link to="/createuser" className="btn btn-warning">Sign-up</Link>

                                </div>
                                :
                                <div>
                                    <button to="/cart" className="btn btn-warning me-2" onClick={() => { setCartView(true) }}>My Cart {" "}

                                        <span className='mw-1 badge bg-danger' >{data.length}</span>
                                    </button>
                                    {cartView ? <Modal onClose={() => setCartView(false)}><Cart /></Modal> : null}
                                    <Link to="" className="btn btn-danger" onClick={handleLogout}>Log Out</Link>

                                </div>
                            }

                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default NavBar 