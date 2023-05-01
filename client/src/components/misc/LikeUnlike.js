import {useAuth} from '../../context/auth'
import {FcLike, FcLikePlaceholder} from 'react-icons/fc'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
// import toast from 'react-hot-toast'
import { toast } from 'react-toastify';

export default function LikeUnlike ({ad}) {
  const [auth, setAuth] = useAuth()
  const navigate = useNavigate()

  const handleLike = async() => {
    try {
      if(auth.user === null) {
        navigate('/login', { //take user to login page if not logged in
          state: `/ad/${ad.slug}`, //to navigate user to adview page after login
        })
        return;
      }
      const {data} = await axios.post('/wishlist', {adId: ad._id})
      // console.log("data", data)
      setAuth({...auth, user: data});
      const fromLS = JSON.parse(localStorage.getItem('auth'));
      fromLS.user = data;
      localStorage.setItem('auth', JSON.stringify(fromLS))
      toast.success("Added to wishlist");
    } catch (err) {
      console.error(err)
    }
  }

  const handleUnlike = async() => {
    try {
      if(auth.user === null) {
        navigate('/login')
        return;
      }
      const {data} = await axios.delete(`/wishlist/${ad._id}`)
      // console.log("data", data)
      setAuth({...auth, user: data});
      const fromLS = JSON.parse(localStorage.getItem('auth'));
      fromLS.user = data;
      localStorage.setItem('auth', JSON.stringify(fromLS))
      toast.success("Remove from wishlist");
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {auth.user?.wishlist?.includes(ad?._id) ? (
        <span><FcLike className='h2 mt-3 pointer' onClick={handleUnlike}/></span>
      ) : (
        <span><FcLikePlaceholder className='h2 mt-3 pointer' onClick={handleLike}/></span>
      )}
    </>
  )
}