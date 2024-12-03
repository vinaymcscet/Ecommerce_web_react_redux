import React from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import './CheckoutForm.css';
import { useSelector } from "react-redux";

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

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
      console.error("Stripe has not loaded properly.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Example payment intent creation (replace with your backend call)
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        createOrderResponse?.clientSecret, // Replace with actual client secret from your server
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: createOrderResponse?.customer, // Replace with actual data
            },
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error.message);
      } else if (paymentIntent.status === "succeeded") {
        // Payment is successful
        navigate("/order-complete"); // Redirect to the order complete page
      }
    } catch (err) {
      console.error("Error during payment:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Total Amount: {formatAmount(amount)}</h3> {/* Example amount display */}
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay {formatAmount(amount)}
      </button>
    </form>
  );
};

export default CheckoutForm;
