import React, {useState} from 'react';
import axios from 'axios';
// import toast from 'react-hot-toast'
import { toast } from 'react-toastify';
import {useNavigate, Link} from 'react-router-dom'

export default function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // console.log(email, password);
      const { data } = await axios.post(`/forgot-password`, {
        email,
      });
      // console.log(data);
      if (data && data.error) {
        setLoading(false);
        toast.error(data.error);
      } else {
        setLoading(false);
        toast.success("Please check you email for password reset link");
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Forgot Password</h1>

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

              <button className="btn btn-primary col-12 mb-4" disabled={loading}>{loading ? "Waiting" : "Submit"}</button>
            </form>

            <Link className='text-danger' to="/login">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}