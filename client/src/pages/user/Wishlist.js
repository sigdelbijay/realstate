import {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/auth';
import AdCard from '../../components/cards/AdCard';
import Sidebar from '../../components/nav/Sidebar';

export default function Wishlist() {
  const [ads, setAds] = useState([]);
  const [auth, setAuth] = useAuth();
  useEffect(() => {
    loadAds();
  }, [auth.token !== null])

  const loadAds = async() => {
    try {
      const {data} = await axios.get('/wishlist');
      console.log("data", data)
      setAds(data);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5" >
        Dashboard
      </h1>
      <Sidebar />
    
      <div className='container'>
        {ads.length > 0 ? (
          <div className='row'>
            {ads?.map((ad) => (
              <AdCard ad={ad} key={ad._id}/>
            ))}
        </div>
        ) : (
          <div className='row'>
            <div className='col-lg-8 offset-lg-2'>
              <p className='text-center'>You have not liked any properties.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}