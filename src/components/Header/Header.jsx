/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import HeaderPin from "../HeaderPin/HeaderPin";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./Header.css";
import Hamburger from "../Hamburger/Hamburger";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setModalType, toggleModal } from "../../store/slice/modalSlice";
import { useDetectOutsideClick } from "../../utils/useDetectOutsideClick";
import { 
  getItemsInCartData, 
  getUserRequest, 
  logoutRequest, 
  searchProductData, 
  viewItemsInCartData } from "../../store/slice/api_integration";
import { device_token } from "../../utils/Constants";
import { getTokensFromLocalStorage } from "../../utils/StorageTokens";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const { user } = useSelector((state) => state.user);
  const { viewCartItems } = useSelector((state) => state.cart);
  
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [toggleModalState, setToggleModalState] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  
  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };
  const handleOpenDialog = (type) => {
    dispatch(setModalType(type));
    setToggleModalState(true);
    dispatch(toggleModal(toggleModalState));
  };
  const redirectToCart = () => {
    dispatch(viewItemsInCartData());
    navigate("/cart");
  };
  const redirectToSupport = () => {
    navigate("/contact");
  };
  
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsActive((prevIsActive) => !prevIsActive); // Properly toggle state
  };

  const handleLogout = () => {
    const responseObj = {
      device_token: device_token
    }
    dispatch(logoutRequest(responseObj)).finally(() => {
      handleOpenDialog('login');
    });
  };

  const handleProfile = () => {
    dispatch(getUserRequest());
  };

  const getFname = () => {
    const[fName, ...lName] = user[0]?.fullname.split(" ");
    return fName;
  }
  useEffect(() => {
    // Clear search value whenever location changes
    if(location.pathname !== '/search') setSearchValue('');
  }, [location]);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    if (query) {
      setSearchValue(query);
    }
  }, [location.search]);

  const handleSearch = () => {
    if(searchValue) {
      const responseObj = {
        keyword: searchValue,
        offset: 0,
        limit: 10,
      }
      dispatch(searchProductData(responseObj));
      navigate(`/search?query=${encodeURIComponent(searchValue)}`);
    }   
  }
  useEffect(() => {
    dispatch(getUserRequest());
    dispatch(viewItemsInCartData());
    // open by default login modal
    const storageTokens = getTokensFromLocalStorage();
    console.log("+++", storageTokens);

    if(!storageTokens?.accessToken) handleOpenDialog('login');
  }, [])
  return (
    <div>
      <HeaderPin />
      <header>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={5} md={4} lg={4} className="leftHead">
              <ul className="leftHeaderMenu">
                <li>
                  <Link to="/">
                    <img src="/images/icons/LOGO1.png" alt="Logo" />
                  </Link>
                </li>
                {/* <li>
                  <img src="/images/icons/deals.png" alt="Hot Deals" />
                  <p>Hot Deals</p>
                </li>
                <li>
                  <img src="/images/icons/stock.png" alt="Hot Deals" />
                  <p>Clear Stock</p>
                </li> */}
              </ul>
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
              <div className="searchPanel">
                <div className="inputBox">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search all categories products"
                    value={searchValue}
                    onChange={(ev) => setSearchValue(ev.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <SearchRoundedIcon 
                    onClick={handleSearch} />
                </div>
              </div>
            </Grid>
            <Grid item xs={0} md={4} lg={4} className="rightHead">
              <ul className={hamburgerOpen ? "rightMenu active" : "rightMenu"}>
                <li onClick={() => redirectToSupport()}>
                  <img src="/images/icons/support.png" alt="Support" />
                  <p>Support</p>
                </li>
                {user.length === 0 && (
                  <li onClick={() => handleOpenDialog("login")}>
                    <img src="/images/icons/login.png" alt="Login" />
                    <p>Login / Sign up</p>
                  </li>
                )}
                {user && user.length > 0 && (
                  <div className="menu-container">
                    <li onClick={toggleUserMenu}>
                      <img 
                          src={user[0]?.profile_pic || user[0]?.data?.profile_pic || '/images/icons/avtar.png'} 
                          alt={user[0]?.fullname || user[0]?.data?.first_name || 'User'} 
                      />
                      {user[0]?.fullname && !user[0].fullname.toLowerCase().includes("undefined") && (
                        <p>{getFname()}</p>
                      )}
                      {user[0].fullname.toLowerCase().includes("undefined") && (
                        <p>{user[0]?.data?.first_name || 'User'}</p>
                      )}
                      <nav
                        ref={dropdownRef}
                        className={`menu ${isActive ? "active" : "inactive"}`}
                      >
                        <ul>
                          <li>
                            <Link to="/userprofile" onClick={handleProfile}>
                              <img
                                src="/images/icons/login.png"
                                alt="Profile"
                              />
                              <span>Profile</span>
                            </Link>
                          </li>
                          <li>
                            <Link to="/" onClick={handleLogout}>
                              <img src="/images/icons/login.png" alt="Logout" />
                              <span>Logout</span>
                            </Link>
                          </li>
                        </ul>
                      </nav>
                    </li>
                  </div>
                )}
                <li onClick={() => redirectToCart()} className="cartItem">
                  <img src="/images/icons/cart.png" alt="Cart" />
                  {viewCartItems?.cartItems != undefined && <span className="cartCount">{viewCartItems?.cartItems.length}</span>}
                  <p>Cart</p>
                </li>
              </ul>
              <div className="hamburgerMenu" onClick={toggleHamburger}>
                <Hamburger isOpen={hamburgerOpen} />
              </div>
            </Grid>
          </Grid>
        </Box>
      </header>
    </div>
  );
};

export default Header;
