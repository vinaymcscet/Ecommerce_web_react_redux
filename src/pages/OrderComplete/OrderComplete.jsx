import React, { useEffect } from "react";
import './OrderComplete.css'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { confirmOrderData } from "../../store/slice/api_integration";

const OrderComplete = () => {
    const dispatch = useDispatch();
    const { createOrderResponse, confirmOrderResponse } = useSelector((state) => state.cart);
    console.log(confirmOrderResponse);
    
    useEffect(() => {
        const responseObj = {
            payment_intent: createOrderResponse?.paymentIntentId,
        }
        dispatch(confirmOrderData(responseObj));
    }, [])
    const navigate = useNavigate();
    return (
        <>
            <div className="order-complete">
                <h1>Thank you</h1>
                <p>for your order</p>
                <img src="/images/check-mark.svg" alt="complete Order" />
                <div className="trackOrder">Track your order</div>
                <p>Order number: {confirmOrderResponse?.orderNumber}</p>

                <button type="button" onClick={() => navigate('/')}>continue shopping</button>
            </div>
        </>
    )
}

export default OrderComplete