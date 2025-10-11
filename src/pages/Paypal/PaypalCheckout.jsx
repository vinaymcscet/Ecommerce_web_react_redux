import React, { useState, useEffect, useCallback } from 'react';
import './PaypalCheckout.css';
import { BASE_URL, PAYPAL_CLIENT_ID, paypalPaymentUrl } from '../../utils/Constants';
import { useLocation } from "react-router-dom";
import { clearCart, setConfirmOrderResponse } from '../../store/slice/cartSlice';
import { viewItemsInCartData } from '../../store/slice/api_integration';
import { setCheckOutFormModal } from '../../store/slice/cartSlice';
import { resetSuccess, setSuccess } from '../../store/slice/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { GET, POST } from "../../utils/API";

const PaypalCheckout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, currency, productName, address_id, offer_id, device_type } = location.state || {};
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  
  // Load PayPal SDK dynamically
  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const loadPayPalSDK = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP&components=buttons,funding-eligibility&enable-funding=googlepay,applepay`;
      script.setAttribute("data-sdk-integration-source", "button-factory");
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      script.onerror = () => {
        setMessage('Failed to load PayPal SDK');
        setPaymentStatus('error');
      };
      document.body.appendChild(script);
    };

    loadPayPalSDK();
  }, []);

  // Handle order creation
  const createOrder = useCallback(async () => {
    setLoading(true);
    setPaymentStatus('processing');
    setMessage('Creating order...');

    try {
      
      // const response = await POST(`/paypal/create-order`, {
      const response = await POST(`createOrder`, {
          amount,
          currency,
          address_id, 
          offer_id, 
          device_type
        });

      if (!response.id) {
        throw new Error('Invalid order data received');
      }
      return response.id;
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Failed to create payment order");
      setPaymentStatus('error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [paypalPaymentUrl]);

  // Handle payment capture
  const onApprove = useCallback(async (data) => {
    setLoading(true);
    setPaymentStatus('processing');
    setMessage('Processing payment...');

    try {
      const captureData = await POST(`capture?orderId=${data.orderID}`);      
      if (captureData.status === 'completed') {
        setMessage(`Payment completed! Order ID: ${captureData.oredr_id || data.orderID}}`);
        // dispatch(setSuccess(`Payment completed! Order ID: ${data.orderID}`));
        // setOrderDetails({ orderId: data.orderID, ...captureData });

        dispatch(setConfirmOrderResponse(captureData));
        dispatch(setSuccess(`Payment completed! Order ID: ${captureData.oredr_id || data.orderID}`));
        dispatch(setCheckOutFormModal(false));
        navigate('/order-complete'); // Redirect to order success page
        

        dispatch(viewItemsInCartData());
        dispatch(clearCart());
        setTimeout(() => {
          dispatch(resetSuccess());
          dispatch(clearCart());
        }, 1000);
      } else {
        setMessage(`Payment status: ${captureData.status}`);
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error("Capture error:", error);
      setMessage("Payment processing failed");
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  }, [paypalPaymentUrl]);

  // Initialize PayPal buttons when SDK is loaded
  useEffect(() => {
    if (!paypalLoaded || !window.paypal) return;

    try {
      const buttons = [
        {
          fundingSource: window.paypal.FUNDING.PAYPAL,
          containerId: 'paypal-button-container'
        },
        {
          fundingSource: window.paypal.FUNDING.CARD,
          containerId: 'card-button-container'
        },
        {
          fundingSource: window.paypal.FUNDING.GOOGLEPAY,
          containerId: 'googlepay-button-container'
        },
        {
          fundingSource: window.paypal.FUNDING.APPLEPAY,
          containerId: 'applepay-button-container'
        }
      ];

      buttons.forEach(({ fundingSource, containerId }) => {
        const button = window.paypal.Buttons({
          fundingSource,
          style: {
            shape: 'rect',
            layout: 'vertical',
            height: 45
          },
          createOrder,
          onApprove,
          onError: (err) => {
            console.error("PayPal error:", err);
            setMessage("Payment failed to initialize");
            setPaymentStatus('error');
          }
        });

        if (button.isEligible()) {
          button.render(`#${containerId}`).catch(err => {
            console.error(`Failed to render ${fundingSource} button:`, err);
          });
        }
      });
    } catch (error) {
      console.error('Error initializing PayPal:', error);
      setMessage('Failed to initialize PayPal');
      setPaymentStatus('error');
    }
  }, [paypalLoaded, createOrder, onApprove]);

  return (
    <div className="paypal-checkout-container">
      <div className="checkout-header">
        <h2>Complete Your Purchase</h2>
        <p>Securely pay with PayPal</p>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="order-details">
          <div className="order-item">
            <span>{productName}</span>
            <span>£{amount}</span>
          </div>
          <div className="order-total">
            <span>Total</span>
            <span>£{amount} GBP</span>
          </div>
        </div>
      </div>

      <div className="payment-section">
        <h3>Payment Method</h3>
        <div className="paypal-button-wrapper">
          <div id="paypal-button-container"></div>
          <div id="card-button-container"></div>
          <div id="googlepay-button-container"></div>
          <div id="applepay-button-container"></div>
          {loading && <div className="payment-loading">Processing payment...</div>}
          {message && (
            <div className={`payment-message ${paymentStatus}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {paymentStatus === 'success' && orderDetails && (
        <div className="payment-success">
          <h3>Payment Successful!</h3>
          <p>Order ID: {orderDetails.orderId}</p>
          <p>Thank you for your purchase.</p>
        </div>
      )}

      <div className="security-note">
        <p>🔒 Your payment information is securely processed by PayPal. We never store your payment details.</p>
      </div>
    </div>
  );
};

export default PaypalCheckout;