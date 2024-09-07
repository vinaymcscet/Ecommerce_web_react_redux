import React from 'react';
import './PageNotFound.css';

const PageNotFound = () => {
  return (
    <div className='notFound'>
        <h4>404 Error</h4>
        <img src="/images/PageNotFound.svg" alt='Page not found' />
        <p>Please check your Internet Connection and Try Again</p>
    </div>
  )
}

export default PageNotFound