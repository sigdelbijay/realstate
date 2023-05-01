import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

import { useSearch } from "../../context/search";
import {GOOGLE_PLACES_KEY} from '../../config';
import {sellPrices, rentPrices} from '../../helpers/priceList';

export default function SearchForm() {
  const [search, setSearch] = useSearch();
  const navigate = useNavigate();

  const handleSearch = async() => {
    try {
      if(!search.address) return toast.error("Please enter an address");
      setSearch({...search, loading: true});
      const {results, page, price, ...rest} = search;
      // console.log("...rest", {...rest})
      // console.log("results", results);

      const query = queryString.stringify(rest);
      console.log("query: " + query);

      const {data} = await axios.get(`/search?${query}`);
      if(search?.page === '/search') {
        setSearch((prev) => ({...prev, results: data, loading: false}))
        navigate(`/search`);
      } else {
        setSearch((prev) => ({...prev, results: data, page: window.location.pathname, loading: false}))
      }
    } catch(err) {
      console.log(err)
      setSearch({...search, loading: false});
    }
  }

  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="form-control">
            <GooglePlacesAutocomplete apiKey={GOOGLE_PLACES_KEY} apiOptions="au" selectProps={{
              defaultInputValue: search && search.address,
              placeholder: "Search for address..",
              onChange: ({value}) => {
                setSearch({...search, address: value.description})
              }
            }}/>
          </div>
          <div className="col-lg-12 d-flex justify-content-center mt-3">
            <button className="btn btn-primary col-lg-2 square" onClick={() => setSearch({...search, action: "Buy", price: ""})}>
              {search.action === 'Buy' ? '✅ Buy' : 'Buy'}
            </button>
            <button className="btn btn-primary col-lg-2 square" onClick={() => setSearch({...search, action: "Rent", price: ""})}>
              {search.action === 'Rent' ? '✅ Rent' : 'Rent'}
            </button>
            <button className="btn btn-primary col-lg-2 square" onClick={() => setSearch({...search, type: "House", price: ""})}>
              {search.type === 'House' ? '✅ House' : 'House'}
            </button>
            <button className="btn btn-primary col-lg-2 square" onClick={() => setSearch({...search, type: "Land", price: ""})}>
              {search.type === 'Land' ? '✅ Land' : 'Land'}
            </button>
            <div className="dropdown">
              <button 
                className="btn btn-primary dropdown-toggle square"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                &nbsp; {search?.price ? search.price : 'Price'}
              </button>
              <ul className="dropdown-menu">
                {search.action === 'Buy' ? (
                  <>
                    {sellPrices.map((item) => (
                      <li key={item._id}>
                        <a 
                          className="dropdown-item"
                          onClick={() => {
                            setSearch({...search, price: item.name, priceRange: item.array})
                          }}
                        >{item.name}</a>
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    {rentPrices.map((item) => (
                      <li key={item._id}>
                        <a 
                          className="dropdown-item"
                          onClick={() => {
                            setSearch({...search, price: item.name, priceRange: item.array})
                          }}
                        >{item.name}</a>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
            
            <button className="btn btn-danger col-lg-2 square" onClick={handleSearch}>Search</button>
          </div>

          {/* <div>{JSON.stringify(search)}</div> */}
        </div>
      </div>
    </>
    
  )
}