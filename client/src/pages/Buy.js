import React, {useState, useEffect} from 'react';
import {useAuth} from '../context/auth';
import axios from 'axios'
import AdCard from '../components/cards/AdCard'
import SearchForm from '../components/forms/SearchForm';

export default function Buy() {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [adsForSale, setAdsForSale] = useState()

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async() => {
    try {
      const {data} = await axios.get('/ads')
      setAdsForSale(data.adsForSale)
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div>
      <SearchForm />
      <h1 className="display-1 bg-primary text-light p-5">For Buy</h1>
      <div className='container'>
        <div className='row'>
          {adsForSale?.map(ad => (
            <AdCard ad={ad} key={ad._id} />
          ))}
        </div>
      </div>
    </div>
    
  )
}