import React, {useEffect} from 'react';
import { useParams, useNavigate } from "react-router-dom";
// import toast from 'react-hot-toast'
import { toast } from 'react-toastify';
import axios from 'axios';
import {useAuth} from '../../context/auth'

export default function AccountActivate() {

  const navigate = useNavigate()
  const [auth, setAuth] = useAuth();
  const { token } = useParams();
  console.log(token);

  useEffect(() => {
    console.log("i am running")
    if(token) requestActivation()
  },[token]);

  const requestActivation = async() => {
    try {
      const {data} = await axios.post(`/register`, {token})
      if(data && data.error) {
        toast.error(data.error)
        console.log("data", data)
      } else {
        localStorage.setItem('auth', JSON.stringify(data))
        setAuth(data)
        toast.success("Successfully logged in. Welcome to the Realist app")
        navigate('/')
      }
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong. Try again.');
    }
  }

  return (
    <div
      className="display-1 d-flex justify-content-center align-items-center vh-100"
      style={{ marginTop: "-5%" }}
    >
      Please wait...
    </div>
  );
}