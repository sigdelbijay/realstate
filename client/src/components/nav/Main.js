import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import {useAuth} from '../../context/auth'

export default function Main() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    setAuth({
      user: null,
      token: "",
      refreshToken: ""
    });
    localStorage.removeItem('auth');
    navigate('/login')
  }

  const loggedIn = auth.user !== null && auth.token !== '' && auth.refreshToken !== '';
  const handlePostAdClick = () => {
    if(loggedIn) {
      navigate('/ad/create')
    } else {
      navigate('/login')
    }
  }

  return (
    <nav className="nav d-flex justify-content-between p-2 lead">
      <NavLink className="nav-link" to="/">
        Home
      </NavLink>

      <NavLink className="nav-link" to="/search">
        Search
      </NavLink>

      <NavLink className="nav-link" to="/buy">
        Buy
      </NavLink>

      <NavLink className="nav-link" to="/rent">
        Rent
      </NavLink>

      <NavLink className="nav-link" to="/agents">
        Agents
      </NavLink>

      <a className='nav-link pointer' onClick={handlePostAdClick}>
        Post Ad
      </a>

      {!loggedIn && (
        <>
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
          <NavLink className="nav-link" to="/register">
            Register
          </NavLink>
        </>
      )}
      
      {loggedIn && (
        <div className="dropdown">
            <a
              className="nav-link pointer dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              {auth && auth.user && auth.user.name ? auth.user.name : auth.user.username}
            </a>
            <nav className="dropdown-menu">
                <NavLink className="nav-link" to={`/dashboard`}>
                  Dashboard
                </NavLink>
                <a className="nav-link" onClick={logout}>Logout</a>
            </nav>
        </div>
      )}
    </nav>
  );
}