import {useState, createContext, useContext} from 'react';

const SearchContext = createContext();

const initialState = {
  address: '',
  action: 'Buy',
  type: 'House',
  price: "0",
  priceRange: [0, 1000000],
  results: [],
  page: '',
  loading: false,
}

const SearchProvider = ({children}) => {
  const [search, setSearch] = useState(initialState);

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  )
}

const useSearch = () => useContext(SearchContext);
export {useSearch, SearchProvider};