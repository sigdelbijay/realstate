import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {IoBedOutline, } from 'react-icons/io5';
import {TbBath} from 'react-icons/tb';
import {BiArea} from 'react-icons/bi';
import dayjs from 'dayjs';
import HTMLRenderer from 'react-html-renderer'
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

import ImageGallery from '../components/misc/ImageGallery'
import Logo from '../logo.svg'
import {formatNumber} from '../helpers/ad';
import relativeTime from 'dayjs/plugin/relativeTime';
import LikeUnlike from '../components/misc/LikeUnlike';
import MapCard from '../components/cards/MapCard';
import AdCard from '../components/cards/AdCard';
import ContactSeller from '../components/forms/ContactSeller';

dayjs.extend(relativeTime);

export default function AdView() {
  const [ad, setAd] = useState({});
  const [related, setRelated] = useState([]);
  const params = useParams()

  useEffect(() => {
    if(params?.slug) fetchAd()
  }, [params?.slug])

  const fetchAd = async() => {
    try {
      const {data} = await axios.get(`/ad/${params.slug}`);
      console.log("data", data)
      setAd(data?.ad)
      setRelated(data?.related)
    } catch(err) {
      console.log(err)
    }
  }

  const generatePhotosArray = (photos) => {
    console.log("photos", photos)
    if(photos?.length > 0) {
      //take half screen if 1 photo exists otherwise fit multiple images there
      const x = photos?.length === 1 ? 2 : 4; 
      let arr = []
      photos.map(photo => arr.push({
        src: photo.Location,
        width: x,
        height: x
      }))
      return arr;
    } else {
      return [{
        src: Logo,
        width: 2,
        height: 1
      }]
    }
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row mt-2'>
          <div className='col-lg-4'>
            <div className='d-flex justify-content-between'>
              <button className='btn btn-primary disabled mt-2'>{ad.type} for {ad.action}</button>
              <LikeUnlike ad={ad}/>
            </div>
            <div className='my-4'>
              {ad?.sold ? "❌ Off Market" : "✅ In Market" }
            </div>
            <h1>{ad.address}</h1>
            <p className='card-text d-flex justify-content-between'>
              {ad?.bedrooms ? (<span><IoBedOutline /> {ad?.bedrooms}</span>): ''}
              {ad?.bathrooms ? (<span><TbBath /> {ad?.bathrooms}</span>): ''}
              {ad?.landsize ? (<span><BiArea /> {ad?.landsize}sqm</span>): ''}
            </p>
            <h3 className='mt-3 h2'>{formatNumber(ad?.price)}</h3>
            <p className='text-muted'>{dayjs(ad?.createdAt).fromNow()}</p>
          </div>
          <div className='col-lg-8'>
            <ImageGallery photos={generatePhotosArray(ad?.photos)}/>
          </div>
        </div>
      </div>

      <div className='container mb-5'>
        <div className='row'>
          <div className='col-lg-8 offset-lg-2 mt-3'>
            <MapCard ad={ad}/>
            <h1>{ad?.type} in {ad?.address} for {ad?.action} ${ad?.price}</h1>
            <p className='card-text d-flex justify-content-between'>
              {ad?.bedrooms ? (<span><IoBedOutline /> {ad?.bedrooms}</span>): ''}
              {ad?.bathrooms ? (<span><TbBath /> {ad?.bathrooms}</span>): ''}
              {ad?.landsize ? (<span><BiArea /> {ad?.landsize}sqm</span>): ''}
            </p>
            <h3 className='fw-bold'>{ad?.title}</h3>
            {/* <ReactQuill theme="snow" value={ad?.description} /> */}
            <HTMLRenderer 
              html={ad?.description?.replaceAll('.', "<br/><br/>")}
            /> 
          </div>
        </div>
      </div>

      <div className='container'>
        <ContactSeller ad={ad}/>
      </div>

      <div className='container-fluid '>
        <h4 className='text-center'>Related Ads</h4>
        <hr style={{width: '33%'}}/>
        <div className='row'>
          {related?.map(ad => <AdCard ad={ad} key={ad._id}/>)}
        </div>
      </div>
      
    </>
  )
}