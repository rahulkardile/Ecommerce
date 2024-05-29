import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartInfo } from "../types/ReduxType";

type Cart_item_propes = {
  cartItem: CartInfo;
  increment: (CartItem: CartInfo) => void;
  decrement: (CartItem: CartInfo) => void;
  remove: (id: string) => void;
};

const Cart_item = ({
  cartItem,
  increment,
  decrement,
  remove,
}: Cart_item_propes) => {
  const { productId, name, price, photo, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={photo} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

      <div className="">
        <button onClick={() => increment(cartItem)}>+</button>
        <p>{quantity}</p>
        <button onClick={() => decrement(cartItem)}>-</button>
      </div>
      <button onClick={() => remove(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default Cart_item;
