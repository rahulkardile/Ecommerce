export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
}

export type CartInfo = {    
        name: string,
        photo: string,
        price: number,
        stock: number,
        quantity: number,
        productId: string
}

export type OrderItem = Omit<CartInfo, "stock"> & { _id: string }

export type NewOrderReq = {
    shippingInfo: ShippingInfo,
    orderItems: CartInfo[],
    subtotal: number,
    tax: number,
    shippingCharges: number,
    discount: number,
    total: number,   
}

export type newOrderReqType = {
          shippingInfo: {
              address: string,
              city: string,
              state: string,
              country: string,
              pinCode: string,
          },
          subtotal: number,
          tax: number,
          shippingCharges: number,
          discount: number,
          total: number,
          orderItems: CartInfo[]
      }


export type OrderType = {
    orderItems: OrderItem[],
    shippingInfo: {
        address: string;
        city: string;
        state: string;
        country: string;
        pin: number;
    };
    subtotal: number,
    tax: number,
    shippingCharges: number,
    discount: number,
    total: number,   
    status: string,
    _id: string,
    user: {
        _id: string,
        name: string
    };
  }

