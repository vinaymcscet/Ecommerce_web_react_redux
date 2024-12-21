import React, { useEffect, useState } from 'react';
import './CookieNotification.css';
import { Link } from 'react-router-dom';
import { setManageCookiesModal } from '../../store/slice/cmsSlice';
import { useDispatch } from 'react-redux';

const CookieNotification = () => {
    const [cookieState, setCookieState] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        setCookieState(true);
    }, []);
    const handleAcceptCookie = () => {
        setCookieState(false);
    }
    const handleManageCookie = () => {
        const payload = {isOpen: true};
        dispatch(setManageCookiesModal(payload))
    }
  return (
    <div className={`cookieNotification ${cookieState ? 'active' : ''}`}>
        <div className="left">
            <h4>DELIVERING THE ULTIMATE EXPERIENCE</h4>
            <p>We use cookies to personalize content, analyze performance, and optimize ads. Learn more or 
            manage your preferences in our <Link to={'/cookies-policy'}>Cookie Policy.</Link>
            </p>
        </div>
        <div className="right">
            {/* <button className='manageCookie' onClick={() => handleManageCookie()}>Decline</button> */}
            <button className='manageCookie' onClick={() => handleAcceptCookie()}>Decline</button>
            <button className='acceptAllookie' onClick={() => handleAcceptCookie()}>Accept</button>
        </div>
    </div>
  )
}

export default CookieNotification