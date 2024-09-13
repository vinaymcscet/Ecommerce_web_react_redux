import React from "react";
import './OrderComplete.css'
import { useNavigate } from "react-router-dom";

const OrderComplete = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="order-complete">
                <h1>Thank you</h1>
                <p>for your order</p>
                <img src="/images/check-mark.svg" alt="complete Order" />
                <div className="trackOrder">Track your order</div>
                <p>Order number: #SC124535</p>

                <button type="button" onClick={() => navigate('/')}>continue shopping</button>
            </div>
        </>
    )
}

export default OrderComplete