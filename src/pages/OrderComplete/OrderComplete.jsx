import React, { useEffect, useState } from "react";
import './OrderComplete.css'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { confirmOrderData, viewItemsInCartData } from "../../store/slice/api_integration";
import { CircularProgress } from "@mui/material";
import { setViewCartItems } from "../../store/slice/cartSlice";

const OrderComplete = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const { createOrderResponse, confirmOrderResponse } = useSelector((state) => state.cart);
    
    useEffect(() => {
        setLoading(true)
        const responseObj = {
            payment_intent: createOrderResponse?.paymentIntentId,
        }
        dispatch(confirmOrderData(responseObj)).finally(() => {
            setLoading(false);
            dispatch(setViewCartItems(null));
        });
    }, [])
    const navigate = useNavigate();
    return (
        <>
            {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : (
                <div className="order-complete">
                    <h1>Thank you</h1>
                    <p>for your order</p>
                    <img src="/images/check-mark.svg" alt="complete Order" />
                    <div className="trackOrder">Track your order</div>
                    <p>Order number: {confirmOrderResponse?.orderNumber}</p>

                    <button type="button" onClick={() => navigate('/')}>continue shopping</button>
                </div>
            )}
        </>
    )
}

export default OrderComplete