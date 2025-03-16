import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckOutFormModal } from '../../store/slice/cartSlice';
import CloseIcon from "@mui/icons-material/Close"
import { CircularProgress } from "@mui/material";
import { STRIPE_PUBLIC_KEY, STRIPE_PUBLIC_PRODUCTION_KEY } from '../../utils/Constants';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../../pages/CheckoutForm/CheckoutForm';
import { Elements } from "@stripe/react-stripe-js";
import './CheckoutModal.css';

const CheckoutModal = () => {
    const { isCheckoutFormModal } = useSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    // const modalRef = useRef(null); 
    const { viewCartItems, clientSecret, createOrderResponse, dpmCheckerLink } = useSelector((state) => state.cart);
    
    // const handleClickOutside = (event) => {
    //     // Close the modal if the click is outside the modal content
    //     if (modalRef.current && !modalRef.current.contains(event.target)) {
    //         closeModal();
    //     }
    // };
    // useEffect(() => {
    //     // Add event listener to detect clicks outside the modal
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //       // Remove event listener on component unmount
    //       document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);

    const closeModal = () => {
        dispatch(setCheckOutFormModal(false));
    };
    if (!isCheckoutFormModal) return null;
    const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    // const stripePromise = loadStripe(STRIPE_PUBLIC_PRODUCTION_KEY);
    const appearance = {
        theme: 'stripe',
    };
    // Enable the skeleton loader UI for optimal loading.
    const loader = 'auto';
    
  return (
    <>
      <div className="checkoutModal">
      <div className="modalBackdrop">
        {/* <div className="modalContent" ref={modalRef}> */}
        <div className="modalContent">
          <div className="close" onClick={() => closeModal()}>
            <CloseIcon />
          </div>
            {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {createOrderResponse && <Elements options={{clientSecret, appearance, loader}} stripe={stripePromise}>
                        <CheckoutForm amount={viewCartItems?.cartPrice?.totalAmount} dpmCheckerLink={dpmCheckerLink} />
                    </Elements>}         
                </>
            )}
        </div>
      </div>
    </div>
  </>
  )
}

export default CheckoutModal