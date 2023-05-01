import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/auth';
import Sidebar from '../../components/nav/Sidebar'
import UserAdCard from '../../components/cards/UserAdCard'

export default function Dashboard() {
  const [auth, setAuth] = useAuth();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState();
  const seller = auth.user?.role?.includes("Seller");

  useEffect(() => {
    fetchAds(page);
  }, [auth.token !== null])

  const fetchAds = async(pageN) => {
    try {
      setLoading(true);
      setPage(pageN);
      const {data} = await axios.get(`/user-ads/${pageN}`)
      if(data?.err) {
        console.log(data.err);
        setLoading(false);
      } else {
        setAds([...ads, ...data.ads]);
        setTotal(data.total);
        setLoading(false);
      }
    } catch(err) {
      console.log(err);
    }
  }

  // const fetchMoreAds = async() => {
  //   try {
  //     const {data} = await axios.get('/user-ads', {page: page+1})
  //     if(data?.err) {
  //       console.log(data.err);
  //     } else {
  //       setAds(data.ads);
  //       setTotal(data.total);
  //     }
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5" >
        Dashboard
      </h1>
      <Sidebar />
      {seller ? (
        <div className='container'>
          <div className='row'>
            <div className='col-lg-8 offset-lg-2'>
              <p className='text-center'>Total {total} ads was found.</p>
            </div>
          </div>
          <div className='row'>
            {ads.length && ads?.map(ad => (
              <UserAdCard key={ad._id} ad={ad} />
            ))}
          </div>
          { ads.length < total ? (
            <div className='row'>
              <div className='col text-center my-4'>
                <button onClick={() => fetchAds(page+1)} disabled={loading} className='btn btn-warning'>
                  {loading ? "Loading...": `${ads?.length} / ${total} Load more`}
                </button>
              </div>

            </div>
            ) : ''}

        </div>
      ) : (
        <div className='d-flex justify-content-center align-items-center vh-100' style={{marginTop: '-10%'}}>
          <h2>Hey {auth.user?.name ? auth.user?.name : auth.user?.username}, Welcome to the Realstate App</h2>
        </div>
      )}


    </div>
    
  )
}