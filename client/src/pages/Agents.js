import {useState, useEffect} from 'react';
import axios from 'axios';
// import {useAuth} from '../../context/auth';
import Sidebar from '../components/nav/Sidebar';
import UserCard from '../components/cards/UserCard';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [auth, setAuth] = useAuth();
  useEffect(() => {
    loadAgents();
  }, [])

  const loadAgents = async() => {
    try {
      const {data} = await axios.get('/agents');
      console.log("data", data)
      setAgents(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
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
        Agents
      </h1>
      <Sidebar />
    
      <div className='container'>
        {agents.length > 0 ? (
          <div className='row'>
            {agents?.map((agent) => (
              <UserCard user={agent} key={agent._id}/>
            ))}
        </div>
        ) : (
          <div className='row'>
            <div className='col-lg-8 offset-lg-2'>
              <p className='text-center'>No agents available.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}