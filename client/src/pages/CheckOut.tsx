import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../redux/Slices/CartSlice";
import { useCreateOrderMutation } from "../redux/API/OrderApi";
import { RootStates } from "../redux/store";
import { CartInfo } from "../types/ReduxType";

// publishable key : pk_test_51OfJtUSGxkvbSJfoi2MlThVVLgwe3EFF1nFoBQ08Sse7nXzsT3BxDVufxhObDhC8psKKxzJhyMLSbTaijLs9P5qA00E6cpFwJE

const Promise = loadStripe(
  "pk_test_51OfJtUSGxkvbSJfoi2MlThVVLgwe3EFF1nFoBQ08Sse7nXzsT3BxDVufxhObDhC8psKKxzJhyMLSbTaijLs9P5qA00E6cpFwJE"
);

const Form = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  // const [order, setOrder] = useState<NewOrderReq>();

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [newOrder] = useCreateOrderMutation();
  const dispatch = useDispatch();

  const order = useSelector((state: RootStates) => state.CartSlice);
  console.log(order);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("All information is needed!");
      return;
    }

    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      console.log(error);
      toast.error("Got an error!");
      setIsProcessing(false);
    }
    if (paymentIntent?.status === "succeeded") {

      const placeOrder = {
        shippingInfo: {
          address: order.shippingInfo.address,
          city: order.shippingInfo.city,
          state: order.shippingInfo.state,
          country: order.shippingInfo.country,
          pinCode: order.shippingInfo.pinCode
        },
        subtotal: (order.subtotal),
        tax: (order.tax),
        shippingCharges: (order.shippingCharges),
        discount: 50,
        total: (order.total),
        orderItems: order.cartItems
      }

      const res = await fetch("/api/order/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(placeOrder)
      })

    const data = await res.json();

    if(data.success === true){
      dispatch(resetCart());
    setIsProcessing(false);
    console.log(paymentIntent);
    navigate("/orders");
      toast.success("Payment successfull");
    }

    toast.error("Could not place order");
    
    }


  };

  return (
    <div className="checkout-handler">
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing . . ." : "Pay"}
        </button>
      </form>
      <p style={{ marginTop: "3rem" }}>
        use this number in test mode:<b> 4000003560000008 </b>
      </p>
    </div>
  );
};

const CheckOut = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    <div style={{ marginTop: "5rem" }}>
      <Elements
        stripe={Promise}
        options={{
          clientSecret,
        }}
      >
        <Form />
      </Elements>
    </div>
  );
};

export default CheckOut;
