import React, { useState } from "react";
import { CardNumberElement,
  CardExpiryElement,
  CardCvcElement, 
  CardElement, 
  useElements, 
  useStripe 
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import './CheckoutForm.css';
import { useSelector } from "react-redux";

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [cardType, setCardType] = useState("");

  const { createOrderResponse } = useSelector((state) => state.cart);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    // }).format(amount / 100); // Stripe amount is in cents, so divide by 100
    }).format(amount); // Stripe amount is in cents, so divide by 100
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // const cardElement = elements.getElement(CardElement);
    const cardNumberElement = elements.getElement(CardNumberElement);
    try {
      // Example payment intent creation (replace with your backend call)
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        createOrderResponse?.clientSecret, // Replace with actual client secret from your server
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: createOrderResponse?.customer, // Replace with actual data
            },
          },
        }
      );
      
      if (error) {
      } else if (paymentIntent.status === "succeeded") {
        // Payment is successful
        navigate("/order-complete"); // Redirect to the order complete page
      }
    } catch (err) {
      // console.error("Error during payment:", err);
    }
  };

  const paymentElementOptions = {
    layout: "accordion",
    hidePostalCode: true,
  }
  const handleCardNumberChange = (event) => {
    if (event.brand) {
      setCardType(event.brand); // Update card brand dynamically
    }
  };
  const getCardBrandIcon = (brand) => {
    const cardBrandIcons = {
      visa: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
      mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      amex: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282019%29.svg",
      discover: "https://upload.wikimedia.org/wikipedia/commons/5/50/Discover_Card_logo.svg",
      diners: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Diners_Club_Logo5.svg",
      jcb: "https://upload.wikimedia.org/wikipedia/commons/1/1f/JCB_logo.svg",
      unionpay: "https://upload.wikimedia.org/wikipedia/commons/8/8c/UnionPay_logo.svg",
    };
    return cardBrandIcons[brand] || "https://img.icons8.com/ios-filled/50/000000/bank-card-back-side.png";
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h3>Total Amount: {formatAmount(amount)}</h3> {/* Example amount display */}
      <div className="formElement">
        <div className="form-group">
          <label>Card Number</label>
          <CardNumberElement className="stripe-input" onChange={handleCardNumberChange} />
          {cardType && (
            <img
              src={getCardBrandIcon(cardType)}
              alt={cardType}
              className="card-brand-icon"
            />
          )}
        </div>
        <div className="form-group">
          <label>Expiration Date</label>
          <CardExpiryElement className="stripe-input" />
        </div>
        <div className="form-group">
          <label>CVC</label>
          <CardCvcElement className="stripe-input" />
        </div>
      </div>
      {/* <CardElement id="payment-element" options={paymentElementOptions}  /> */}
      <button type="submit" disabled={!stripe}>
        {`Pay ${formatAmount(amount)}` }
      </button>
    </form>
  );
};

export default CheckoutForm;
