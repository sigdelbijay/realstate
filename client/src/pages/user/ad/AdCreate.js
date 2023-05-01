import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/nav/Sidebar'

export default function AdCreate() {
  const [sell, setSell] = useState(false);
  const [rent, setRent] = useState(false);
  const navigate = useNavigate();

  const handleSell = () => {
    setSell(true);
    setRent(false);
  }

  const handleRent = () => {
    setRent(true);
    setSell(false);
  }

  const handleSellHouse = () => navigate('/ad/create/sell/house');
  const handleSellLand = () => navigate('/ad/create/sell/land');
  const handleRentHouse = () => navigate('/ad/create/rent/house');
  const handleRentLand = () => navigate('/ad/create/rent/land');

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">
        Ad Create
      </h1>
      <Sidebar />
      <div className='d-flex justify-content-center align-items-center vh-100' style={{marginTop: '-16%'}}>
        <div className='col-lg-6'>
          <button className='btn btn-primary btn-lg col-12 p-5' onClick={handleSell}>
            <span className='h2'>SELL</span>
          </button>
          {sell && (
            <div className='my-1'>
              <button className='btn btn-secondary p-5 col-6' onClick={handleSellHouse}>House</button>
              <button className='btn btn-secondary p-5 col-6' onClick={handleSellLand}>Land</button>
            </div>
          )}
        </div>
        <div className='col-lg-6'>
          <button className='btn btn-primary btn-lg col-12 p-5' onClick={handleRent}>
            <span className='h2'>RENT</span>
          </button>
          {rent && (
            <div className='my-1'>
              <button className='btn btn-secondary p-5 col-6' onClick={handleRentHouse}>House</button>
              <button className='btn btn-secondary p-5 col-6' onClick={handleRentLand}>Land</button>
            </div>
          )}
        </div>
      </div>

    </div>
    
  )
}