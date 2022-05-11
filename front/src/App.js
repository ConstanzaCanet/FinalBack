import './App.css';
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { sessionService } from './services';
import { isLogin } from './utils';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
const Home = React.lazy(() => import('./Pages/Home'));
const Register = React.lazy(() => import('./Pages/Register'));
const Login = React.lazy(() => import('./Pages/Login'))
const ProductDetails = React.lazy(() => import('./Pages/ProductDescription'));
const NewProduct = React.lazy(()=>import('./Pages/NewProduct'));
const Chat = React.lazy(()=>import('./Pages/Chat'));
const Cart = React.lazy(()=>import('./Pages/Cart'));
function App() {
  const callbackSuccessCurrent = (response) => {
    if (response.data.error) {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
    }
    else{
      localStorage.setItem('user',JSON.stringify(response.data.payload));
    }
  }
  const callbackErrorCurrent = (response) => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
  if (isLogin()) {
    sessionService.current({ callbackSuccess: callbackSuccessCurrent, callbackError: callbackErrorCurrent });
  }

  return (
    <Suspense fallback="Loading...">
      <Router >
        <Routes>
          <Route element={<PrivateRoute isLogged={isLogin()} />}>
            <Route path="/" element={<Home />} />
            <Route path='/products/:pid' element={<ProductDetails/>} />
            <Route path='/newproduct' element={<NewProduct/>}/>
            <Route path='/chat' element={<Chat/>}/>
            <Route path='/cart' element={<Cart/>}/>
          </Route>
          <Route element={<PublicRoute isLogged={isLogin()} />}>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
