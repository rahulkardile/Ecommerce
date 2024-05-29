import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartInfo, ShippingInfo } from "../../types/ReduxType";
import toast from "react-hot-toast";

export type CartState = {
  loading: boolean;
  cartItems: CartInfo[];
  subtotal: number;
  discount: number;
  tax: number;
  stock: number;
  shippingCharges: number;
  total: number;
  shippingInfo: ShippingInfo;
};

const initialState: CartState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  stock: 0,
  shippingCharges: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
};

export const CartSlice = createSlice({
  name: "CartSlice",
  initialState,
  reducers: {
    
    addItem: (state, action: PayloadAction<CartInfo>) => {
      state.loading = true;

      const index = state.cartItems.findIndex(
        (i) => i.productId === action.payload.productId
      );

      if (index !== -1) {
        state.cartItems[index] = action.payload;
        state.loading = false;
      } else {
        state.cartItems.push(action.payload);
        state.loading = false;
        toast.success(`${action.payload.name} added to cart`);
      }
    },
    
    removeCart: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (i) => String(i.productId) !== String(action.payload)
      );
      state.loading = false;
    },

    calculatePrice: (state) => {
      const subtotal = state.cartItems.reduce((initial, current) => initial + current.price * current.quantity, 0);

      state.subtotal = subtotal;
      state.shippingCharges = state.subtotal < 50 ? 0 : state.subtotal > 1000 ? 200 : 100;
      state.tax = Math.round(state.subtotal * 0.18);
      state.total = state.subtotal + state.tax + state.shippingCharges - state.discount;
    },

    applyCoupon: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
      state.total -= state.discount
    },

    removeCoupon: (state) => {
      state.discount = 0
      state.total -= state.discount
    },

    savaShippingInfo: (state, action: PayloadAction<ShippingInfo>)=>{
      state.shippingInfo=  action.payload;
    },
    resetCart: () => initialState,

  },

});

export const { addItem, removeCart, calculatePrice, applyCoupon, removeCoupon, savaShippingInfo, resetCart } = CartSlice.actions;
