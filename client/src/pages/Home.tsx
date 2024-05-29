import { Link } from "react-router-dom";
import Crousel from "../Components/Crousel";
import Card from "../Components/Card";
import toast from "react-hot-toast";
import { addItem } from "../redux/Slices/CartSlice";
import { useDispatch } from "react-redux";
import { CartInfo } from "../types/ReduxType";
import { Product } from "../types/types";
import { useEffect, useState } from "react";

const Home = () => {

  const [Products, setProducts] = useState<Product[]>([]);
  const controller = new AbortController();

  useEffect(()=>{
      const data = async() => {
        
        const signal = new AbortController().signal;
        const x = await fetch("/api/product/latest", { signal });
        const res = await x.json();

        if(res.success === true){
          setProducts(res.Product);
        }else{
          toast.error("We are facing some issue!");
          console.log(res);
        }
      }
      data();
      return controller.abort();
  },[])
  
  const dispatch = useDispatch();
  const CardHandler = (cartItem: CartInfo) => {

    if(cartItem.stock < 0) return toast.error("product is currently out of stock!")

    dispatch(addItem(cartItem))
    
  };

  return (
    <div className="main">
      <section className="">
        <Crousel />

      </section>

      <div className="card-product">
        <div className="main-titles">
          <p>Latest Products</p>
          <Link to={"/search"} className="findMore">
            More
          </Link>
        </div>

        <main className="products">
          {Products?.length > 0 ? (
            Products.map((product, i) => (
              <Card
                productId={product._id}
                name={product.name}
                price={product.price}
                Stock={product.stock}
                photo={`/api/${product.photo}`}
                handler={CardHandler}
                key={i}
              />
            ))
          ): "We are Geting some issue"}
        </main>
      </div>
    </div>
  );
};

export default Home;
