import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from "@mui/icons-material/Close"
import { CircularProgress } from "@mui/material";
import './ManageCookies.css';
import { setManageCookiesModal } from '../../store/slice/cmsSlice';

const ManageCookies = () => {
    const { isManageCookiesModal } = useSelector((state) => state.cms);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const closeModal = () => {
        dispatch(setManageCookiesModal(false));
    };
    if (!isManageCookiesModal) return null;
   
    
  return (
    <>
      <div className="cookiesModal">
      <div className="modalBackdrop">
        <div className="modalContent">
          <div className="close" onClick={() => closeModal()}>
            <CloseIcon />
          </div>
            {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : (
                <div className='manageCookiesSection'>
                  <h4>Manage Cookies</h4>
                  <div className="manageCookieContent">
                    <div className='cookie'>
                      <div className="cookieHeader">
                        <h3>Affiliate Cookies</h3>
                        <label class="switch">
                          <input type="checkbox" />
                          <span class="slider round"></span>
                        </label>
                      </div>
                      <p>Affialate cookies are used by us to understand and measures sales from affialate partners.
                        Affialates are companies who promote Setridgesand our products on third-party sites and link through to our website.
                      </p>
                    </div>
                    <div className='cookie'>
                      <div className="cookieHeader">
                        <h3>Affiliate Cookies</h3>
                        <label class="switch">
                          <input type="checkbox" />
                          <span class="slider round"></span>
                        </label>
                      </div>
                      <p>Affialate cookies are used by us to understand and measures sales from affialate partners.
                        Affialates are companies who promote Setridgesand our products on third-party sites and link through to our website.
                      </p>
                    </div>
                    <div className='cookie'>
                      <div className="cookieHeader">
                        <h3>Affiliate Cookies</h3>
                        <label class="switch">
                          <input type="checkbox" />
                          <span class="slider round"></span>
                        </label>
                      </div>
                      <p>Affialate cookies are used by us to understand and measures sales from affialate partners.
                        Affialates are companies who promote Setridgesand our products on third-party sites and link through to our website.
                      </p>
                    </div>
                    <div className='cookie'>
                      <div className="cookieHeader">
                        <h3>Affiliate Cookies</h3>
                        <label class="switch">
                          <input type="checkbox" />
                          <span class="slider round"></span>
                        </label>
                      </div>
                      <p>Affialate cookies are used by us to understand and measures sales from affialate partners.
                        Affialates are companies who promote Setridgesand our products on third-party sites and link through to our website.
                      </p>
                    </div>
                    <div className='cookie'>
                      <div className="cookieHeader">
                        <h3>Affiliate Cookies</h3>
                        <label class="switch">
                          <input type="checkbox" />
                          <span class="slider round"></span>
                        </label>
                      </div>
                      <p>Affialate cookies are used by us to understand and measures sales from affialate partners.
                        Affialates are companies who promote Setridgesand our products on third-party sites and link through to our website.
                      </p>
                    </div>
                  </div>
                  <div className="manageCookieFooter">
                    <button type='button'>Save Preferences</button>
                  </div>
                </div>
            )}
        </div>
      </div>
    </div>
  </>
  )
}

export default ManageCookies