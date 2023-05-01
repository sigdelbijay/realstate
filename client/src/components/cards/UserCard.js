import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import {Badge} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Logo from '../../logo.svg'

dayjs.extend(relativeTime);

export default function UserCard({user}) {
  const [listings, setListings] = useState(0);

  useEffect(() => {
    if(user?._id) {
      fetchAdListings();
    }
  }, [user._id])

  const fetchAdListings = async() => {
    try {
      const {data} = await axios.get(`/agent-ad-count/${user._id}`);
      console.log("data", data)
      setListings(data)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="col-lg-4 p-4 gx-4 gy-4">
      <Link to={`/agent/${user?.username}`}>
      <Badge.Ribbon text={`${listings} listings`} >
        <div className="card hoverable shadow">
          <img 
            src={user?.photo?.Location || Logo} 
            alt={`${user?.username}`}
            style={{ height:'250px', objectFit: "cover" }}
          />

          <div className="card-body">
            <h3>${user?.name || user.username}</h3>
            <p className='card-text'>{dayjs(user.createdAt).fromNow()}</p>
            <p className='card-text'>{user?.phone}</p>
            <p className='card-text'>{user?.company}</p>
            <p className='card-text'>{user?.address}</p>
          </div>
        </div>
      </Badge.Ribbon>
    </Link>
    </div>
  )
}