import React from 'react';
import './PageNotFound.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='notFound'>
		<Helmet>
			<title>{'Oops! Page Not Found | FikFis'}</title>
			<meta name="description" content={'The page you’re looking for doesn’t exist or may have been moved. Don’t worry, let’s get you back on track!'} />
		</Helmet>
		<h4> 404 – Page Not Found</h4>
		<img src="/images/404-Image.png" alt='Page not found' />
        <p>Looks like you’ve hit a dead end! <br /> The page you’re looking for might have been removed, renamed, or never existed.</p>
		<div className='btn-wrapper'>
			<button type="button" onClick={() => navigate('/')}>Go to Homepage</button>
			<button type="button" onClick={() => navigate('/allcategory')}>Browse Our Collections</button>
			<button type="button" onClick={() => navigate('/contact')}>Contact Support</button>
		</div>
		<p>Still lost? Let us help! Reach out to our support team for assistance.</p>
    </div>
  )
}

export default PageNotFound