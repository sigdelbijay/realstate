import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import UserCard from '../components/cards/UserCard';
import AdCard from '../components/cards/AdCard';

import Sidebar from '../components/nav/Sidebar';

export default function AgentView () {
  const [agent, setAgent] = useState();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  useEffect(() => {
    if(params?.username) {
      fetchAgent();
    }
  }, [params?.username])

  const fetchAgent = async() => {
    try {
      const {data} = await axios.get(`/agent/${params.username}`);
      setAgent(data.user);
      setAds(data.ads);
      setLoading(false);
    } catch(err) {
      console.log(err)
      setLoading(false);
    }
  }

  if(loading) {
    return (
      <div className="container p-5 text-center">
        <h4 className="display-1">Loading...</h4>
      </div>
    )
  }
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5" >
        {agent?.name || agent?.username} 
      </h1>
      
      <div className='container'>
        <div className='row justify-content-center'>
          <UserCard user={agent}/>
        </div>

        <h2 className='text-center'>Recent Listings</h2>
        <div className='row'>
          {ads.map(ad => (
            <AdCard ad={ad} key={ad._id}/>
          ))}
        </div>
      </div>
    </div>
  )
}