import React, {useEffect} from 'react';
import { useParams, useNavigate } from "react-router-dom";
// import toast from 'react-hot-toast'
import { toast } from 'react-toastify';
import axios from 'axios';
import {useAuth} from '../../context/auth'

export default function AccessAccount() {

  const navigate = useNavigate()
  const [auth, setAuth] = useAuth();
  const { token } = useParams();
  console.log(token);

  useEffect(() => {
    if(token) requestAccess()
  },[token]);

  const requestAccess = async() => {
    try {
      const {data} = await axios.post(`/access-account`, {resetCode: token})
      if(data && data.error) {
        toast.error(data.error)
        console.log("data", data)
      } else {
        localStorage.setItem('auth', JSON.stringify(data))
        setAuth(data)
        toast.success("Please update your password in profile page")
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