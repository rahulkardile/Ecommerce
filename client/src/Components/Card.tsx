import '../styles/app.scss'
import { FaPlus } from 'react-icons/fa'
import { CartInfo } from '../types/ReduxType';

type productsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  Stock: number;
  handler: (cartItem: CartInfo) => string | undefined
}

const Card = ({ productId, photo, price, name, Stock, handler }: productsProps) => {
  return (
    <div className='card'>
      <img src={`${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹ {price}</span>

      <div className="">
        <button onClick={() => handler({
          productId, photo, price, name, quantity: 1, stock: Stock
        })}><FaPlus /></button>
      </div>

    </div>
  )
}

export default Card