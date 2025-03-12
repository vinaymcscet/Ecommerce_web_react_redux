import React, { useEffect, useState } from "react";
import './OrderComplete.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { confirmOrderData, viewItemsInCartData } from "../../store/slice/api_integration";
import { CircularProgress } from "@mui/material";
import { setViewCartItems } from "../../store/slice/cartSlice";

const OrderComplete = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { createOrderResponse, confirmOrderResponse } = useSelector((state) => state.cart);
    const params = new URLSearchParams(location.search);
  
    const paymentIntentId = params.get("payment_intent");
    
    useEffect(() => {
        if(!createOrderResponse || !confirmOrderResponse) {
            navigate('/');
            return;
        }
        setLoading(true)
        const responseObj = {
            payment_intent: createOrderResponse?.paymentIntentId || paymentIntentId,
        }
        dispatch(confirmOrderData(responseObj)).finally(() => {
            setLoading(false);
            dispatch(setViewCartItems(null));
        });
    }, [])
    return (
        <>
            {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : (
                confirmOrderResponse ? (
                    <div className="order-complete">
                    <h1>Thank you</h1>
                    <p>for your order</p>
                    <img src="/images/check-mark.svg" alt="complete Order" />
                    <div className="trackOrder">Track your order</div>
                    <p>Order number: {confirmOrderResponse?.orderNumber}</p>

                    <button type="button" onClick={() => navigate('/')}>continue shopping</button>
                </div>
                ) : ""
            )}
        </>
    )
}

export default OrderComplete