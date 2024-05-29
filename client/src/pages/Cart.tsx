import React, { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import Cart_item from "../Components/Cart";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CartState,
  addItem,
  applyCoupon,
  calculatePrice,
  removeCart,
  removeCoupon,
} from "../redux/Slices/CartSlice";
import { CartInfo } from "../types/ReduxType";

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>();
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const dispatch = useDispatch();
  const {
    cartItems,
    loading,
    shippingCharges,
    shippingInfo,
    discount,
    stock,
    subtotal,
    tax,
    total,
  } = useSelector((state: { CartSlice: CartState }) => state.CartSlice);

  const IncreamentHandler = (CartInfo: CartInfo) => {
    if (CartInfo.quantity >= CartInfo.stock) return 0;

    dispatch(
      addItem({
        ...CartInfo,
        quantity: CartInfo.quantity + 1,
      })
    );
  };

  const DecreamentHandler = (CartItem: CartInfo) => {
    if (CartItem.quantity <= 1) return;

    dispatch(
      addItem({
        ...CartItem,
        quantity: CartItem.quantity - 1,
      })
    );
  };

  const RemoveHandler = (id: string) => {
    dispatch(removeCart(id));
  };

  const controller = new AbortController();

  useEffect(() => {

    const timeOutId = setTimeout(async () => {
      const signal = controller.signal;

      const data = await fetch(
        `/api/payment/coupon/discount?code=${couponCode}`,
        { signal }
      );

      const res = await data.json();

      if (res.success === true) {
        setIsValidCouponCode(true);
        dispatch(applyCoupon(res.amount));
      } else {
        setIsValidCouponCode(false);
        dispatch(applyCoupon(0));
      }
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);

      controller.abort();
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main className="">
        {cartItems.length > 0 ? (
          cartItems.map((data, i) => (
            <Cart_item
              key={i}
              cartItem={data}
              increment={IncreamentHandler}
              decrement={DecreamentHandler}
              remove={RemoveHandler}
            />
          ))
        ) : (
          <h1>There is no selected Items . . .</h1>
        )}
      </main>

      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Tax: ₹{tax}</p>
        <p>Shipping Charges : ₹{shippingCharges}</p>
        <p>
          Discount: <em>₹{discount}</em>
        </p>
        <p>
          Total : <b>₹{total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to={"/shipping"}>Check Out</Link>}
      </aside>
    </div>
  );
};

export default Cart;
