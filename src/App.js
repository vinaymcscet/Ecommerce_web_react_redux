import React, { Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Modal from "./components/Modal/Modal";
import CategoryModal from "./components/CategoryModal/CategoryModal";
import { ToastContainer, toast } from "react-toastify";

import "./App.css";
import { setError, setSuccess } from "./store/slice/modalSlice";
import { setUser } from "./store/slice/userSlice";
import { getTokensFromLocalStorage } from "./utils/StorageTokens";
import CancelOrderModal from "./components/CancelOrderModal/CancelOrderModal";
import CoupensModal from "./components/CoupensModal/CoupensModal";
import CheckoutModal from "./components/CheckoutModal/CheckoutModal";
import ManageCookies from "./components/ManageCookies/ManageCookies";
import DeleteHeader from "./components/DeleteHeader/DeleteHeader";
import RoutePage from "./Routes/RoutePage";

const Offline = React.lazy(() => import("./pages/Offline/Offline"));
const AddressModal = React.lazy(() => import("./components/AddressModal/AddressModal"));

function App() {
  const location = useLocation();
  const { isAddressModelOpen, error, success } = useSelector(
    (state) => state.modal
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up the event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        toast.success(success);
        setSuccess("");
      }, 1000);
    }
    if (error) {
      if(error.toLowerCase().includes('accesstoken')) {
        return;
      }
      if(error.toLowerCase().includes('no cartitems found.')) {
        return;
      }
      setTimeout(() => {
        toast.error(error);
        setError("");
      }, 1000);
    }
  }, [success, error]);

  useEffect(() => {
    const tokens = getTokensFromLocalStorage();
    if(tokens) {
      dispatch(setUser(tokens));
    }
  }, []);

  if (!isOnline) {
    return <Offline />;
  }

  return (
    <div className="App">
      {location.pathname === "/delete-account" ? (
        <DeleteHeader />
      ) : (
        <Header />
      )}
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="loading">
            <img src="/images/icons/LOGO.png" alt="Logo" />
          </div>
        }
      >
        <RoutePage /> 
      </Suspense>
      <Footer />
      <Modal />
      <CategoryModal />
      <CancelOrderModal />
      <CoupensModal />
      <CheckoutModal />
      <ManageCookies />
      {isAddressModelOpen && (
        <Suspense fallback={<div>Loading Address Modal...</div>}>
          <AddressModal />
        </Suspense>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
