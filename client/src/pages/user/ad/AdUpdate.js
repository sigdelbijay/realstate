import {useState, useEffect} from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import CurrencyInput from 'react-currency-input-field';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';

import {GOOGLE_PLACES_KEY} from '../../../config';
import ImageUpload from "../../../components/forms/ImageUpload";
import Sidebar from '../../../components/nav/Sidebar';



export default function AdUpdate() {

  const [ad, setAd] = useState({
    _id: '',
    photos: [],
    uploading: false,
    price: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    carpark: '',
    landsize: '',
    title: '',
    description: '',
    loading: false,
    type: '',
    action: '',
  })
  const [loaded, setLoaded] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(params?.slug) {
      loadAd();
    }
  }, [params?.slug])

  const loadAd = async() => {
    try {
      const {data} = await axios.get(`/ad/${params.slug}`);
      console.log(data);
      setAd({...ad, ...data.ad});
      setLoaded(true);
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      if(!ad.photos?.length) {
        toast.error("Photo is required");
      } else if(!ad.price) {
        console.log("Photo is required")
        toast.error("Price is required");
      } else if(!ad.description) {
        toast.error("Description is required");
      } else {
        console.log("check i am here")
        setAd({...ad, loading: true})
        const {data} = await axios.put(`/ad/${ad._id}`, ad);
        console.log("ad create response: " + data)
        if(data?.error) {
          toast.error(data.error);
          setAd({...ad, loading: false});
        } else {
          toast.success("Ad updated successfully");
          setAd({...ad, loading: false});
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = async(e) => {
    e.preventDefault();
    try {
      setAd({...ad, loading: true})
      const {data} = await axios.delete(`/ad/${ad._id}`);
      console.log("ad delete response: " + data)
      if(data?.error) {
        toast.error(data.error);
        setAd({...ad, loading: false});
      } else {
        toast.success("Ad deleted successfully");
        setAd({...ad, loading: false});
        navigate('/dashboard');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">
        Ad Update
      </h1>
      <Sidebar />
      <div className='container'>
        <div className="mb-3 form-control">
          <ImageUpload ad={ad} setAd={setAd}/>
          { ad.address ? (
            <GooglePlacesAutocomplete apiKey={GOOGLE_PLACES_KEY} apiOptions="au" selectProps={{
              defaultInputValue: ad && ad.address,
              placeholder: "Search for address..",
              onChange: ({value}) => {
                setAd({...ad, address: value.description})
              }
            }}/>
          ) : ''}
        </div>

        {loaded ? (
          <div style={{marginTop: '80px'}}>
            <CurrencyInput 
              placeholder='Enter price'
              defaultValue={ad.price}
              className='form-control  mb-3'
              onValueChange={(value) => setAd({...ad, price: value})}
            />
          </div>
        ): ''}

        {ad.type === 'House' && (
          <>
            <input 
              type='number'
              min='0'
              className="form-control mb-3"
              placeholder="Enter how many bedrooms"
              value={ad.bedrooms}
              onChange={(e) => setAd({...ad, bedrooms: e.target.value})}
            />

            <input 
              type='number'
              min='0'
              className="form-control mb-3"
              placeholder="Enter how many bathrooms"
              value={ad.bathrooms}
              onChange={(e) => setAd({...ad, bathrooms: e.target.value})}
            />  

            <input 
              type='number'
              min='0'
              className="form-control mb-3"
              placeholder="Enter how many carpark"
              value={ad.carpark}
              onChange={(e) => setAd({...ad, carpark: e.target.value})}
            />
          </>
        )}

        <input 
          type='text'
          className="form-control mb-3"
          placeholder="Size of land"
          value={ad.landsize}
          onChange={(e) => setAd({...ad, landsize: e.target.value})}
        />

        <input 
          type='text'
          className="form-control mb-3"
          placeholder="Enter title"
          value={ad.title}
          onChange={(e) => setAd({...ad, title: e.target.value})}
        />

        <textarea 
          className="form-control mb-3"
          placeholder="Enter Description"
          value={ad.description}
          onChange={(e) => setAd({...ad, description: e.target.value})}
        />

        <button className={`btn btn-primary ${ad.loading ? 'disabled' : ''} mb-5`} onClick={handleSubmit}>
          {ad.loading? 'Saving...' : 'Submit'}
        </button>

        <button className={`btn btn-danger ${ad.loading ? 'disabled' : ''} mb-5 ml-4`} onClick={handleDelete}>
          {ad.loading? 'Deleting...' : 'Delete'}
        </button>

      </div>
    </div>
  )
}