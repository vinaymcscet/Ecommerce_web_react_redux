import React, { useState } from "react";
import HeaderPin from "../HeaderPin/HeaderPin";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./Header.css";
import Hamburger from "../Hamburger/Hamburger";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setModalType, toggleModal } from "../../store/slice/modalSlice";

const Header = () => {
  const dispatch = useDispatch();

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };
  const handleOpenDialog = (type) => {
    dispatch(setModalType(type));
    dispatch(toggleModal(true));
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
                <li onClick={() => handleOpenDialog('login')}>
                  <img src="/images/icons/login.png" alt="Login" />
                  <p>Login / Sign up</p>
                </li>
                <li>
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
