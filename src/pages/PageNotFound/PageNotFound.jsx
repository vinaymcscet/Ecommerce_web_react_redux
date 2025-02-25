import React from 'react';
import './PageNotFound.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PageNotFound = () => {
  const navigate = useNavigate();
  const currentUrl = window.location.href;
  return (
    <div className='notFound'>
		<Helmet>
			<title>{'Oops! Page Not Found | FikFis'}</title>
			<meta name="description" content={'The page you’re looking for doesn’t exist or may have been moved. Don’t worry, let’s get you back on track!'} />
			{/* <!-- Open Graph / Facebook --> */}
			<meta property="og:title" content={'Oops! Page Not Found | FikFis'} />
			<meta property="og:description" content={'The page you’re looking for doesn’t exist or may have been moved. Don’t worry, let’s get you back on track!'} />
			<meta property="og:image" content={'/images/icons/LOGO1.png'} />
			<meta property="og:url" content={currentUrl} />
			<meta property="og:type" content="article" />
			{/* <!-- Twitter --> */}
			<meta property="twitter:card" content="article" />
			<meta property="twitter:url" content={currentUrl} />
			<meta property="twitter:title" content={'Oops! Page Not Found | FikFis'} />
			<meta property="twitter:description" content={'The page you’re looking for doesn’t exist or may have been moved. Don’t worry, let’s get you back on track!'} />
			<meta property="twitter:image" content={'/images/icons/LOGO1.png'} />
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