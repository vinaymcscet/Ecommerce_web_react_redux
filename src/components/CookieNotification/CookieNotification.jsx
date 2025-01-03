import React, { useEffect, useState } from 'react';
import './CookieNotification.css';
import { Link } from 'react-router-dom';
// import { setManageCookiesModal } from '../../store/slice/cmsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getCooiesStatus, getCookiesInfo } from '../../store/slice/api_integration';

const CookieNotification = () => {
    const { cookiesInfo } = useSelector(state => state.user)
    const [cookieState, setCookieState] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCookiesInfo()).finally(() => {
            if(Number(cookiesInfo) === 0) {
                setCookieState(true);
            } else if(Number(cookiesInfo) === 1) {
                setCookieState(false);
            }
        })
    }, [cookiesInfo]);
    const handleAcceptCookie = () => {
        const payload = { status: 1 };
        dispatch(getCooiesStatus(payload)).finally(() => {
            dispatch(getCookiesInfo());
            setCookieState(false);
        });
    }
    const handleManageCookie = () => {
        // const payload = {isOpen: true};
        // dispatch(setManageCookiesModal(payload))
        const payload = { status: 0 };
        dispatch(getCooiesStatus(payload)).finally(() => {
            dispatch(getCookiesInfo());
            setCookieState(false);
        });
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
            <button className='manageCookie' onClick={() => handleManageCookie()}>Decline</button>
            <button className='acceptAllookie' onClick={() => handleAcceptCookie()}>Accept</button>
        </div>
    </div>
  )
}

export default CookieNotification