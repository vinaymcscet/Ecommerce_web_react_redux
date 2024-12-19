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
            <h4>Giving you the best experience</h4>
            <p>we use cookies and similar technologies to personalise content, analyse website performance 
                and tailor and measure ads. Learn exactly how we do this and manage setting in our <Link>Cookie Policy.</Link>
            </p>
        </div>
        <div className="right">
            <button className='manageCookie' onClick={() => handleManageCookie()}>Manage cookies</button>
            <button className='acceptAllookie' onClick={() => handleAcceptCookie()}>Accept all</button>
        </div>
    </div>
  )
}

export default CookieNotification