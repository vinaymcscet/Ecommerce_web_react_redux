import React, { useState } from "react";
import {
  useElements, 
  useStripe ,
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import './CheckoutForm.css';
import { useSelector } from "react-redux";

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const { createOrderResponse } = useSelector((state) => state.cart);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
  }).format(amount);
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Call elements.submit() to validate the PaymentElement before proceeding
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message);
      return;
    }

    const clientSecret = createOrderResponse?.clientSecret;
    
    if (!clientSecret) {
      setMessage("Missing clientSecret. Please contact support.");
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
        return_url: `${window.location.origin}/order-complete`,
        payment_method_data: {
          billing_details: {
            address: {
              country: "UK", // Provide the country explicitly
            },
          },
        },
      },
    });
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      navigate("/order-complete");
    }
  };

  return (
      <form id="payment-form" onSubmit={handleSubmit}>
        {/* <LinkAuthenticationElement id="link-authentication-element"
          // Access the email value like so:
          // onChange={(event) => {
          //  setEmail(event.value.email);
          // }}
          //
          // Prefill the email field like so:
          // options={{defaultValues: {email: 'foo@bar.com'}}}
          /> */}
        <PaymentElement 
          id="payment-element" 
          options={{
            fields: {
              billingDetails: {
                address: {
                  country: "never", // Hides the country field
                },
              },
            },
          }}
        />
        
        <button disabled={!stripe || !elements} id="submit">
          <span id="button-text">
            {`Pay ${formatAmount(amount)}`}
          </span>
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
  );
};

export default CheckoutForm;
