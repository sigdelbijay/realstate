import React, {useState} from 'react';
import axios from 'axios';
// import toast from 'react-hot-toast'
import { toast } from 'react-toastify';
import {useNavigate, Link, useLocation} from 'react-router-dom'
import {useAuth} from '../context/auth'

export default function Login() {

  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // console.log(email, password);
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });
      // console.log(data);
      if (data && data.error) {
        setLoading(false);
        toast.error(data.error);
      } else {
        setLoading(false);
        //update context
        setAuth(data);
        //update local storage
        localStorage.setItem('auth', JSON.stringify(data))
        toast.success("Login successful");
        location?.state !== null ? navigate(location.state) : navigate('/dashboard');
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Login</h1>

      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4 mt-5">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter your email"
                className="form-control mb-4"
                required
                autoFocus
                value={email}
                onChange={e=>setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter your password"
                className="form-control mb-4"
                required
                value={password}
                onChange={e=>setPassword(e.target.value)}
              />

              <button className="btn btn-primary col-12 mb-4" disabled={loading}>{loading ? "Waiting" : "Login"}</button>
            </form>

            <Link className='text-danger' to="/auth/forgot-password">Forgot Password</Link>
          </div>
        </div>
      </div>
    </div>
  );
}