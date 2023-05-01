import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export default function RedirectRoute () {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(currentCount => currentCount - 1)
    }, 1000)
    if(count === 0) navigate('/')
    return () => clearInterval(interval)
  }, [count])

  return (
    <div className='container'>
      <div className='d-flex justify-content-center align-items-center vh-100 text-center'>
        <h3>Please Login. Redirecting in {count} seconds.</h3>
      </div>
    </div>
  )
}