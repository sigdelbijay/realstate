import React, {useState, useEffect} from 'react';
import AdCard from '../components/cards/AdCard'

import SearchForm from '../components/forms/SearchForm';
import {useSearch} from '../context/search';

export default function Search() {
  const [search, setSearch] = useSearch();
  console.log("search", search)
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Search</h1>
      <SearchForm />
      <div className='container'>
        <div className='row'>
          {search.results?.length > 0 ? (
            <div className='col-md-12 text-center p-5'>
              Found {search.results.length} results
            </div>
          ): (
            <div className='col-md-12 text-center p-5'>
              No properties found
            </div>
          )}
        </div>
        <div className='row'>
          {search.results.map(ad => (
            <AdCard ad={ad} key={ad._id} />
          ))}
        </div>
      </div>
    </div>
    
  )
}