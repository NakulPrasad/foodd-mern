import React from 'react';
import './App.css';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './screens/Signup';
import { CartProvider } from './components/ContextReducer'
import MyOrder from './screens/MyOrder';
import Login from './screens/Login/Login';
import LoginNew from './screens/Login/LoginNew';

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/login2' element={<LoginNew />} />
            <Route path='/createuser' element={<Signup />} />
            <Route path='/myOrder' element={<MyOrder />} />


          </Routes>
        </div>
      </Router>

    </CartProvider>
  );
}

export default App;
