import {useState} from 'react';
import axios from 'axios';
// import toast from 'react-hot-toast';
import { toast } from 'react-toastify';

import Sidebar from "../../components/nav/Sidebar"
export default function Settings () {

  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      if(password !== confirmPassword) {
        toast.error("Password and confirm password do not match")
        return;
      }
      setLoading(true);
      const {data} = await axios.put('/update-password', {password})
      if(data?.error) {
        setLoading(false);
        toast.error(data.error);
        console.log(data?.error)
      } else {
        setLoading(false);
        toast.success("Password updated successfully");
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
        setLoading(false);
        toast.error("Error updating password");
        console.error(err)
    }
  }
  return (
    <>
      <h1 className="display-1 bg-primary text-light p-5">
        Settings
      </h1>
      <Sidebar />

      <div className='container mt-2'>
        <div className="row">
          <div className='col-lg-8 offset-lg-2'>
            <form onSubmit={handleSubmit}>
              <input 
                type='password'
                min='6'
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

              <input 
                type='password'
                min='6'
                className="form-control mb-3"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />         

              <button className={`btn btn-primary col-12 mb-5 ${loading ? 'disabled' : ''}`}>
              {loading? 'Updating...' : 'Update'}
          </button>
            </form>
          </div>
            
        </div>
        
      </div>
    </>
  )
}