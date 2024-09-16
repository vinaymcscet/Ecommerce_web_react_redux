/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import HeaderPin from "../HeaderPin/HeaderPin";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./Header.css";
import Hamburger from "../Hamburger/Hamburger";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setModalType, toggleModal } from "../../store/slice/modalSlice";
import { setLogout } from '../../store/slice/userSlice';
import { useDetectOutsideClick } from "../../utils/useDetectOutsideClick";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { user } = useSelector((state) => state.user);

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };
  const handleOpenDialog = (type) => {
    dispatch(setModalType(type));
    dispatch(toggleModal(true));
  };
  const redirectToCart = () => {
    navigate("/cart");
  };

  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsActive((prevIsActive) => !prevIsActive); // Properly toggle state
  };

  const handleLogout = () => {
    dispatch(setLogout()); // Clear the user array in Redux
    navigate("/"); // Redirect after logout
  };

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
                    <img src="/images/icons/logo.png" alt="Logo" />
                  </Link>
                </li>
                <li>
                  <img src="/images/icons/deals.png" alt="Hot Deals" />
                  <p>Hot Deals</p>
                </li>
                <li>
                  <img src="/images/icons/stock.png" alt="Hot Deals" />
                  <p>Clear Stock</p>
                </li>
              </ul>
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
              <div className="searchPanel">
                <select name="select category" className="selectCategory">
                  <option>Categories</option>
                  <option>Categories 1</option>
                  <option>Categories 2</option>
                  <option>Categories 3</option>
                </select>
                <div className="inputBox">
                  <input
                    type="text"
                    placeholder="Search all categories products"
                  />
                  <SearchRoundedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={0} md={0} lg={4} className="rightHead">
              <ul className={hamburgerOpen ? "rightMenu active" : "rightMenu"}>
                <li>
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
                      <img src={user[0]?.image} alt={user[0]?.name} />
                      <p>{user[0]?.name}</p>
                      <nav
                        ref={dropdownRef}
                        className={`menu ${isActive ? "active" : "inactive"}`}
                      >
                        <ul>
                          <li>
                            <Link to="/userprofile">
                              <img
                                src="/images/icons/login.png"
                                alt="Profile"
                              />
                              <span>Profile</span>
                            </Link>
                          </li>
                          <li>
                            <a onClick={handleLogout}>
                              <img src="/images/icons/login.png" alt="Logout" />
                              <span>Logout</span>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </li>
                  </div>
                )}
                <li onClick={() => redirectToCart()}>
                  <img src="/images/icons/cart.png" alt="Cart" />
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
