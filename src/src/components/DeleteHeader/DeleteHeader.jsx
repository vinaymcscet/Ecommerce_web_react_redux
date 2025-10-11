import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DeleteHeader.css';

const DeleteHeader = () => {
  const navigate = useNavigate();
  return (
    <div className='deleteHeaderBox'>
        <div className="leftLogo">
            <Link to="/">
                <img src="/images/icons/logo.svg" alt="Logo" />
            </Link>
        </div>
        <div className='rightHeader'>
            <button type="button" className='support' onClick={() => navigate('/contact')}>Support</button>
            <button type="button" className='headerContact' onClick={() => navigate('/contact')}>Contact Us</button>
        </div>
    </div>
  )
}

export default DeleteHeader