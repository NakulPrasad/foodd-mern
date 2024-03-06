import React from 'react';
import './App.css';
import Home from './screens/Home';
import Login from './screens/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './screens/Signup';
import { CartProvider } from './components/ContextReducer'
import MyOrder from './screens/MyOrder';
import Login2 from './screens/Login/Login2';

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/createuser' element={<Signup />} />
            <Route path='/myOrder' element={<MyOrder />} />
            <Route path='/login2' element={<Login2 />} />
            


          </Routes>
        </div>
      </Router>

    </CartProvider>
  );
}

export default App;
