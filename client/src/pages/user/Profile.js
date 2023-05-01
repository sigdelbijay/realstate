import {useState, useEffect} from 'react'
import axios from 'axios'
// import toast from 'react-hot-toast'
import { toast } from 'react-toastify';
import slugify from 'slugify'

import {useAuth} from '../../context/auth'
import Sidebar from "../../components/nav/Sidebar";
import ProfileUpload from '../../components/forms/ProfileUpload';

export default function Profile () {
  const [auth, setAuth] = useAuth();

  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [company, setCompany] = useState();
  const [address, setAddress] = useState();
  const [phone, setPhone] = useState();
  const [about, setAbout] = useState();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if(auth?.user) {
      setUsername(auth.user?.username)
      setName(auth.user?.name)
      setEmail(auth.user?.email)
      setCompany(auth.user?.company)
      setAddress(auth.user?.address)
      setPhone(auth.user?.phone)
      setAbout(auth.user?.about)
      setPhoto(auth.user?.photo)
    }
  }, [])

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const {data} = await axios.put('/update-profile', {username, name, email, company, phone, address, about, photo})
      if(data?.error) {
        setLoading(false);
        toast.error(data.error);
      } else {
        setLoading(false);
        setAuth({...auth, user: data})

        let fromLS = JSON.parse(localStorage.getItem('auth'));
        fromLS.user = data;
        localStorage.setItem('auth', JSON.stringify(fromLS));
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    
  }

  return (
    <>
      <h1 className="display-1 bg-primary text-light p-5">
        Profile
      </h1>
      <Sidebar />


      <div className='container mt-2'>
        <div className="row">
          <div className='col-lg-8 offset-lg-2'>
            <form onSubmit={handleSubmit}>
              <ProfileUpload photo={photo} setPhoto={setPhoto} uploadingPhoto={uploadingPhoto} setUploadingPhoto={setUploadingPhoto}/>
              <input 
                type='text'
                // min='0'
                className="form-control mb-3"
                placeholder="Update your username"
                value={username}
                onChange={(e) => setUsername(slugify(e.target.value.toLowerCase()))}
                />

              <input 
                type='text'
                // min='0'
                className="form-control mb-3"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />      

              <input 
                type='text'
                // min='0'
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />   

              <input 
                type='text'
                // min='0'
                className="form-control mb-3"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                />   

              <input 
                type='number'
                // min='0'
                className="form-control mb-3"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                /> 

              <input 
                type='text'
                // min='0'
                className="form-control mb-3"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                />   

              <input 
                type='text'
                // min='0'
                className="form-control mb-3"
                placeholder="Write something about you"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={200}
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